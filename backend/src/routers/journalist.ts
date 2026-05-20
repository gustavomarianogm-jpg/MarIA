import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { supabase } from '../supabase';

export const journalistRouter = router({
  // Jornalista registra interesse em uma pauta (sem login)
  acceptMatch: publicProcedure
    .input(z.object({
      storyId: z.string().uuid(),
      email: z.string().email('E-mail inválido')
    }))
    .mutation(async ({ input }) => {
      // 1. Busca o jornalista pelo e-mail
      const { data: journalist, error: journalistError } = await supabase
        .from('users')
        .select('id, name, outlet')
        .eq('email', input.email)
        .eq('role', 'journalist')
        .single();

      if (journalistError || !journalist) {
        throw new Error('E-mail não encontrado na base de jornalistas. Cadastre-se primeiro.');
      }

      // 2. Verifica se existe um match pendente para essa story + jornalista
      const { data: existingMatch } = await supabase
        .from('matches')
        .select('id, status')
        .eq('storyId', input.storyId)
        .eq('journalistId', journalist.id)
        .single();

      if (existingMatch) {
        // Atualiza para "interested"
        await supabase
          .from('matches')
          .update({ status: 'interested', updatedAt: new Date().toISOString() })
          .eq('id', existingMatch.id);
      } else {
        // Cria um novo match com status "interested"
        await supabase
          .from('matches')
          .insert({
            storyId: input.storyId,
            journalistId: journalist.id,
            status: 'interested'
          });
      }

      // 3. Notifica o empreendedor (dono da pauta)
      const { data: story } = await supabase
        .from('stories')
        .select('title, users!inner(name, email)')
        .eq('id', input.storyId)
        .single();

      if (story) {
        // @ts-ignore
        const owner = Array.isArray(story.users) ? story.users[0] : story.users;
        if (owner && owner.email) {
          import('../notify').then(({ notifyClientMatch }) => {
            notifyClientMatch(owner.email, owner.name, story.title, [{
              name: journalist.name,
              score: 100,
              outlet: journalist.outlet
            }]).catch(err => {
              console.error('[JOURNALIST] Erro ao notificar empreendedor:', err);
            });
          });
          
          // Retorna os dados da fonte para o jornalista
          return { 
            ok: true, 
            message: 'Interesse registrado com sucesso!',
            sourceContact: {
              name: owner.name,
              email: owner.email
            }
          };
        }
      }

      return { ok: true, message: 'Interesse registrado com sucesso!' };
    }),
});
