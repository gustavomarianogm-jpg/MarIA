"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const supabase_1 = require("../supabase");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const notify_1 = require("../notify");
const SYSTEM_PROMPT = `Você é a MarIA, a primeira assessora de imprensa virtual do Brasil. Jornalista experiente com 15 anos de redação, empática, direta e profissional. Sua missão é conduzir uma entrevista jornalística estruturada para criar um release profissional.

REGRAS ABSOLUTAS:
- Faça UMA pergunta por vez. NUNCA faça duas perguntas na mesma mensagem.
- Use português brasileiro natural. Emojis com moderação (máx. 1 por mensagem).
- NUNCA invente informações. Use APENAS o que o entrevistado disser.
- Siga RIGOROSAMENTE a sequência de 7 etapas abaixo. NÃO pule etapas.
- Durante o chat: use negrito com PARCIMÔNIA — no máximo 1-2 palavras-chave por mensagem. NUNCA use títulos markdown (#, ##) no chat.
- NUNCA use itálico (asterisco simples *texto*) nas suas mensagens.

SEQUÊNCIA OBRIGATÓRIA DA ENTREVISTA:

ETAPA 1 — Saudação: Você já recebeu o nome do usuário na primeira mensagem do sistema. Cumprimente-o pelo nome e pergunte sobre o que ele quer falar hoje. Seja acolhedora.

ETAPA 2 — O que aconteceu? (Abertura): Peça para o entrevistado contar o fato principal. "Me conta mais! Sobre o que vamos falar hoje?" Objetivo: capturar o tema da pauta.

ETAPA 3 — Quando? (Timing/Embargo): Pergunte EXPLICITAMENTE sobre datas. "Quando isso acontece ou aconteceu? Tem uma data específica de lançamento ou embargo?" Objetivo: saber se é urgente ou tem data de embargo.

ETAPA 4 — Por que AGORA? (Gancho): Pergunte por que esse é o momento certo. "Por que esse é o momento certo para contar essa história?" Objetivo: criar urgência e relevância jornalística.

ETAPA 5 — Quem fala? (Citação): Identifique o porta-voz. "Quem é a pessoa certa para falar sobre isso? Me dá uma frase dela!" Objetivo: ter uma citação direta para o release.

ETAPA 6 — Tem números? (Dados): Peça dados concretos. "Tem algum número, crescimento ou resultado que prove o impacto?" Objetivo: dar credibilidade com dados.

ETAPA 7 — Tem mídia? (Fotos/Vídeos): Pergunte sobre material visual. "Tem fotos, vídeos ou documentos para enriquecer a história?" Objetivo: complementar visualmente.

FINALIZAÇÃO: Somente APÓS coletar informações de TODAS as 7 etapas, diga:
"Perfeito! Tenho tudo para montar sua pauta agora... ✨ Clique em **Gerar release** para ver o resultado!"

Se o entrevistado der respostas vagas ou incompletas em qualquer etapa, faça perguntas de acompanhamento para extrair mais detalhes ANTES de avançar para a próxima etapa.`;
const getAnthropic = () => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key)
        return null;
    return new sdk_1.default({ apiKey: key });
};
exports.chatRouter = (0, trpc_1.router)({
    sendMessage: trpc_1.publicProcedure
        .input(zod_1.z.object({
        messages: zod_1.z.array(zod_1.z.object({
            role: zod_1.z.enum(['user', 'assistant']),
            content: zod_1.z.string()
        }))
    }))
        .mutation(async ({ ctx, input }) => {
        try {
            let userName = 'empreendedor';
            if (ctx.user) {
                const { data: userProfile } = await supabase_1.supabase
                    .from('users')
                    .select('name')
                    .eq('id', ctx.user.id)
                    .single();
                if (userProfile?.name) {
                    userName = userProfile.name.split(' ')[0];
                }
            }
            const personalizedPrompt = SYSTEM_PROMPT + `\n\nO nome do entrevistado é: ${userName}.`;
            const anthropic = getAnthropic();
            if (!anthropic) {
                throw new Error('A chave da API do Anthropic (Claude) não está configurada.');
            }
            const response = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 500,
                system: personalizedPrompt,
                messages: input.messages,
            });
            // @ts-ignore
            return { ok: true, text: response.content[0].text };
        }
        catch (err) {
            throw new Error(err.message || 'Erro ao conectar com a IA');
        }
    }),
    generateRelease: trpc_1.publicProcedure
        .input(zod_1.z.object({
        messages: zod_1.z.array(zod_1.z.object({
            role: zod_1.z.enum(['user', 'assistant']),
            content: zod_1.z.string()
        }))
    }))
        .mutation(async ({ ctx, input }) => {
        if (ctx.user) {
            // Verifica se tem créditos na tabela credits
            const { data: creditData, error: creditError } = await supabase_1.supabase
                .from('credits')
                .select('balance, totalUsed')
                .eq('userId', ctx.user.id)
                .single();
            if (creditError || !creditData || creditData.balance <= 0) {
                throw new Error('Você não tem créditos suficientes.');
            }
        }
        const today = new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
        const pr = `Com base na conversa, escreva um release jornalístico profissional em português do Brasil.

A DATA DE HOJE É ${today}. NUNCA invente ou chute datas. Para a demarcação [Data], use a data de hoje, a menos que o usuário tenha especificado uma data de embargo explícita na entrevista.

REGRAS DE QUALIDADE E FORMATAÇÃO (MUITO IMPORTANTE):
1. NUNCA invente dados. Sempre use exatamente o que o usuário forneceu. Se faltar algo, escreva [a informar].
2. NUNCA invente data. Utilize a data informada nesta instrução ou a fornecida pelo usuário.
3. No release final, use negrito APENAS em: (a) título principal, (b) cabeçalho de cidade/data, (c) nome da pessoa citada, (d) seções "Sobre" e "Contato para Imprensa". NUNCA use negrito em parágrafos comuns.
4. NUNCA use itálico (asterisco simples) no texto.
5. O título principal do release DEVE ter no máximo 12 palavras, com gancho jornalístico claro. Deve usar capitalização de frase comum (apenas a primeira letra da frase e nomes próprios em maiúsculo). NUNCA capitalize a primeira letra de todas as palavras.

ESTRUTURA OBRIGATÓRIA:
# [Título chamativo até 12 palavras]
**[Cidade, Estado]** — **[Data]** — [Lide: quem, o quê, quando, onde, por quê — em um único parágrafo]

[Corpo - Parágrafo 1: Contexto e fato principal]

[Corpo - Parágrafo 2: Gancho - por que importa agora e impacto]

"[Citação marcante do porta-voz]", afirma **[Nome da pessoa citada]**, [Cargo].

[Corpo - Parágrafo 3: Background e conclusão]

### Box de Dados
- [Dado ou número relevante 1]
- [Dado ou número relevante 2]

## Sobre [empresa]
[Parágrafo institucional]

## Contato para imprensa
Nome: | Tel: | E-mail:

---
Release gerado pela MarIA — A 1ª Assessora de Imprensa Virtual do Brasil`;
        try {
            const anthropicClient = getAnthropic();
            if (!anthropicClient) {
                throw new Error('A chave da API do Anthropic (Claude) não está configurada no servidor.');
            }
            const response = await anthropicClient.messages.create({
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 2000,
                messages: [...input.messages, { role: 'user', content: pr }],
            });
            // @ts-ignore
            const releaseText = response.content[0].text;
            const titleMatch = releaseText.match(/^#\s+(.+)$/m);
            const releaseTitle = titleMatch ? titleMatch[1] : 'Nova pauta';
            // Guest logic
            if (!ctx.user) {
                try {
                    const { data: conv } = await supabase_1.supabase.from('conversations').insert({
                        userId: null,
                        title: releaseTitle,
                        status: 'completed'
                    }).select('id').single();
                    if (conv) {
                        const msgsToInsert = input.messages.map(m => ({
                            conversationId: conv.id,
                            role: m.role,
                            content: m.content
                        }));
                        await supabase_1.supabase.from('messages').insert(msgsToInsert);
                        const { data: story } = await supabase_1.supabase.from('stories').insert({
                            userId: null,
                            conversationId: conv.id,
                            title: releaseTitle,
                            content: releaseText,
                            status: 'review'
                        }).select('id').single();
                        if (story) {
                            await (0, notify_1.notifyCuradoria)({
                                clientName: 'Visitante (Demonstração)',
                                title: releaseTitle,
                                content: releaseText,
                                storyId: story.id
                            });
                            // Extrair tags também para visitantes
                            (async () => {
                                try {
                                    const anthropicClient = getAnthropic();
                                    if (!anthropicClient)
                                        return;
                                    const tagsResponse = await anthropicClient.messages.create({
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
                                        await supabase_1.supabase
                                            .from('stories')
                                            .update({ tags })
                                            .eq('conversationId', conv.id);
                                    }
                                }
                                catch (tagErr) { }
                            })();
                        }
                    }
                }
                catch (e) {
                    console.error('Erro ao salvar pauta de visitante:', e);
                }
                return { ok: true, text: releaseText, title: releaseTitle };
            }
            // DB logic for authenticated users
            const { data: conv } = await supabase_1.supabase.from('conversations').insert({
                userId: ctx.user.id,
                title: releaseTitle,
                status: 'completed'
            }).select('id').single();
            if (conv) {
                const msgsToInsert = input.messages.map(m => ({
                    conversationId: conv.id,
                    role: m.role,
                    content: m.content
                }));
                await supabase_1.supabase.from('messages').insert(msgsToInsert);
            }
            let createdStoryId = null;
            try {
                const { data: storyId, error: rpcError } = await supabase_1.supabase.rpc('create_story_with_credit', {
                    p_user_id: ctx.user.id,
                    p_conversation_id: conv?.id || null,
                    p_title: releaseTitle,
                    p_content: releaseText
                });
                if (rpcError || !storyId) {
                    throw new Error(`Erro na transação de crédito/pauta: ${rpcError?.message}`);
                }
                createdStoryId = storyId;
                const { data: userProfile } = await supabase_1.supabase
                    .from('users')
                    .select('name')
                    .eq('id', ctx.user.id)
                    .single();
                const notifyResult = await (0, notify_1.notifyCuradoria)({
                    clientName: userProfile?.name || 'Cliente',
                    title: releaseTitle,
                    content: releaseText,
                    storyId: createdStoryId || undefined
                });
                if (!notifyResult.ok) {
                    throw new Error(notifyResult.error || 'Falha ao notificar equipe de curadoria.');
                }
            }
            catch (txnError) {
                throw new Error(txnError.message || 'Erro crítico durante a geração e processamento do release.');
            }
            (async () => {
                try {
                    const anthropicClient = getAnthropic();
                    if (!anthropicClient)
                        return;
                    const tagsResponse = await anthropicClient.messages.create({
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
                        await supabase_1.supabase
                            .from('stories')
                            .update({ tags })
                            .eq('conversationId', conv?.id || '');
                    }
                }
                catch (tagErr) {
                    console.error('[CHAT] Falha ao extrair tags:', tagErr);
                }
            })();
            return { ok: true, text: releaseText, title: releaseTitle };
        }
        catch (err) {
            throw new Error(err.message || 'Erro ao gerar release');
        }
    }),
});
