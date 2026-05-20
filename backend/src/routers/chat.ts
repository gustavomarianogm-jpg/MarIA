import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { supabase } from '../supabase';
import Anthropic from '@anthropic-ai/sdk';
import { notifyCuradoria } from '../notify';

const SYSTEM_PROMPT = `Você é a MarIA, assessora de imprensa virtual do Brasil. Jornalista experiente, empática e direta. Missão: entrevistar para criar release profissional. Regras: 1 pergunta por vez. Português BR. Emojis ocasionais. Colete: o quê, por que agora, quem fala, dados, contato E SEMPRE pergunte qual a data de lançamento ou embargo do release. Após 4+ respostas, diga: "Pronto! Tenho tudo para escrever um release incrível. ✍️ Clique em **Gerar release** para ver o resultado!"`;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const chatRouter = router({
  sendMessage: protectedProcedure
    .input(z.object({
      messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string()
      }))
    }))
    .mutation(async ({ input }) => {
      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: input.messages,
        });

        // @ts-ignore
        return { ok: true, text: response.content[0].text };
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao conectar com a IA');
      }
    }),

  generateRelease: protectedProcedure
    .input(z.object({
      messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string()
      }))
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Verifica se tem créditos na tabela credits
      const { data: creditData, error: creditError } = await supabase
        .from('credits')
        .select('balance, totalUsed')
        .eq('userId', ctx.user.id)
        .single();
        
      if (creditError || !creditData || creditData.balance <= 0) {
        throw new Error('Você não tem créditos suficientes.');
      }

      const today = new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
      const pr = `Com base na conversa, escreva um release jornalístico profissional em português do Brasil.\n\nA DATA DE HOJE É ${today}. NUNCA invente ou chute datas. Para a demarcação [Data], use a data de hoje, a menos que o usuário tenha especificado uma data de embargo explícita na entrevista.\n\nREGRAS DE FORMATAÇÃO (MUITO IMPORTANTE):\n1. NÃO USE negrito no corpo do texto (como em nomes de pessoas, cargos ou palavras de ênfase).\n2. Limite o uso de negrito APENAS à demarcação de cidade/data no início e aos subtítulos.\n3. O título principal do release DEVE usar capitalização de frase comum (apenas a primeira letra da frase e nomes próprios/cidades/siglas em maiúsculo). NUNCA capitalize a primeira letra de todas as palavras.\n\nESTRUTURA:\n# [Título chamativo até 12 palavras]\n**[Cidade, Estado] — [Data]** — [Lead: 2-3 linhas respondendo Quem, O quê, Quando, Onde, Por quê]\n\n[Parágrafo 1 — fato principal]\n\n[Parágrafo 2 — gancho: por que importa agora?]\n\n"[Citação marcante do porta-voz]", afirma [Nome], [Cargo].\n\n[Parágrafo 3 — dados e impacto]\n\n[Parágrafo 4 — background]\n\n## Sobre [empresa]\n[Parágrafo institucional]\n\n## Contato para imprensa\nNome: | Tel: | E-mail:\n\n---\n*Release gerado pela MarIA — A 1ª Assessora de Imprensa Virtual do Brasil*\n\nUSE APENAS dados fornecidos. Se algo não foi informado, escreva [a informar].`;

      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 2000,
          messages: [...input.messages, { role: 'user', content: pr }],
        });

        // @ts-ignore
        const releaseText = response.content[0].text;
        const titleMatch = releaseText.match(/^#\s+(.+)$/m);
        const releaseTitle = titleMatch ? titleMatch[1] : 'Nova pauta';

        // 2. Grava a conversa (conversation) no banco
        const { data: conv } = await supabase.from('conversations').insert({
          userId: ctx.user.id,
          title: releaseTitle,
          status: 'completed'
        }).select('id').single();

        if (conv) {
          // Grava as mensagens atreladas à conversa
          const msgsToInsert = input.messages.map(m => ({
            conversationId: conv.id,
            role: m.role,
            content: m.content
          }));
          await supabase.from('messages').insert(msgsToInsert);
        }

        // 3. OPERAÇÃO ATÔMICA: Cria Story -> Debita Crédito -> Notifica
        let createdStoryId: string | null = null;
        let creditDebited = false;

        try {
          // A. Cria a Story (valida schemas e salva o conteúdo)
          const { data: storyData, error: storyError } = await supabase.from('stories').insert({
            userId: ctx.user.id,
            conversationId: conv?.id || null,
            title: releaseTitle,
            content: releaseText,
            status: 'review'
          }).select('id').single();

          if (storyError || !storyData) throw new Error('Erro ao salvar pauta no banco de dados.');
          createdStoryId = storyData.id;

          // B. Debita o crédito
          const { error: creditUpdateError } = await supabase.from('credits').update({ 
            balance: creditData.balance - 1,
            totalUsed: creditData.totalUsed + 1
          }).eq('userId', ctx.user.id);

          if (creditUpdateError) throw new Error('Erro ao debitar crédito.');
          creditDebited = true;

          // C. Notifica curadoria de forma SÍNCRONA
          const { data: userProfile } = await supabase
            .from('users')
            .select('name')
            .eq('id', ctx.user.id)
            .single();

          const notifyResult = await notifyCuradoria({
            clientName: userProfile?.name || 'Cliente',
            title: releaseTitle,
            content: releaseText,
            storyId: conv?.id || undefined
          });

          if (!notifyResult.ok) {
            throw new Error(notifyResult.error || 'Falha ao notificar equipe de curadoria.');
          }

        } catch (txnError: any) {
          // Lógica de ROLLBACK
          if (creditDebited) {
            await supabase.from('credits').update({ 
              balance: creditData.balance,
              totalUsed: creditData.totalUsed
            }).eq('userId', ctx.user.id);
          }
          if (createdStoryId) {
            await supabase.from('stories').delete().eq('id', createdStoryId);
          }
          throw new Error('Falha na transação. Nenhum crédito foi cobrado. ' + txnError.message);
        }

        // 4. Extrai tags da pauta via IA (fire-and-forget, sem impacto na transação)
        (async () => {
          try {
            const tagsResponse = await anthropic.messages.create({
              model: 'claude-3-5-sonnet-20240620',
              max_tokens: 150,
              messages: [
                { role: 'user', content: `Analise este release e extraia de 3 a 5 tags/categorias que representem os temas principais. Responda APENAS um JSON array de strings em minúsculas, sem explicação. Exemplo: ["tecnologia", "startup", "fintech"]\n\nRelease:\n${releaseText}` }
              ]
            });
            // @ts-ignore
            const tagsText = tagsResponse.content[0].text.trim();
            const tags = JSON.parse(tagsText);
            if (Array.isArray(tags)) {
              await supabase
                .from('stories')
                .update({ tags })
                .eq('conversationId', conv?.id);
            }
          } catch (tagErr) {
            console.error('[CHAT] Falha ao extrair tags:', tagErr);
          }
        })();

        return { ok: true, text: releaseText, title: releaseTitle };
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao gerar release');
      }
    }),
});
