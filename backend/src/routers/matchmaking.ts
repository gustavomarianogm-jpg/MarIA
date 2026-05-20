import { z } from 'zod';
import { router, adminProcedure } from '../trpc';
import { supabase } from '../supabase';

export const matchmakingRouter = router({
  // Roda o matchmaking para uma story aprovada
  run: adminProcedure
    .input(z.object({ storyId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      // 1. Busca a story e suas tags
      const { data: story, error: storyError } = await supabase
        .from('stories')
        .select('id, tags, targetCity, targetState')
        .eq('id', input.storyId)
        .single();

      if (storyError || !story) throw new Error('Pauta não encontrada.');
      
      const storyTags: string[] = story.tags || [];
      if (storyTags.length === 0) {
        return { ok: true, matches: 0, message: 'Pauta sem tags. Nenhum match gerado.' };
      }

      // 2. Busca todos os jornalistas com tags
      const { data: journalists, error: journalistError } = await supabase
        .from('users')
        .select('id, name, tags, city, state')
        .eq('role', 'journalist');

      if (journalistError || !journalists) throw new Error('Erro ao buscar jornalistas.');

      // 3. Calcula score de overlap para cada jornalista
      const matchResults: Array<{ journalistId: string; score: number; name: string }> = [];

      for (const journalist of journalists) {
        const journalistTags: string[] = journalist.tags || [];
        if (journalistTags.length === 0) continue;

        // Tags em comum (case-insensitive)
        const storyTagsLower = storyTags.map(t => t.toLowerCase().trim());
        const journalistTagsLower = journalistTags.map(t => t.toLowerCase().trim());
        const commonTags = storyTagsLower.filter(t => journalistTagsLower.includes(t));

        const score = Math.round((commonTags.length / storyTagsLower.length) * 100);

        // Bonus de localidade: se cidade ou estado batem, +20 pontos
        let locationBonus = 0;
        if (story.targetCity && journalist.city && 
            story.targetCity.toLowerCase() === journalist.city.toLowerCase()) {
          locationBonus += 20;
        } else if (story.targetState && journalist.state &&
                   story.targetState.toLowerCase() === journalist.state.toLowerCase()) {
          locationBonus += 10;
        }

        const finalScore = Math.min(score + locationBonus, 100);

        if (finalScore >= 30) {
          matchResults.push({
            journalistId: journalist.id,
            score: finalScore,
            name: journalist.name
          });
        }
      }

      if (matchResults.length === 0) {
        return { ok: true, matches: 0, message: 'Nenhum jornalista com overlap suficiente.' };
      }

      // 4. Ordena por score decrescente e insere os matches
      matchResults.sort((a, b) => b.score - a.score);

      const matchInserts = matchResults.map(m => ({
        storyId: input.storyId,
        journalistId: m.journalistId,
        status: 'pending'
      }));

      const { error: insertError } = await supabase
        .from('matches')
        .upsert(matchInserts, { onConflict: 'storyId,journalistId' });

      if (insertError) throw new Error('Erro ao salvar matches: ' + insertError.message);

      // Notifica o cliente com a lista de matches (Passo 8)
      const { data: storyOwner } = await supabase
        .from('stories')
        .select('title, users!inner(name, email)')
        .eq('id', input.storyId)
        .single();

      if (storyOwner) {
        // @ts-ignore
        const user = Array.isArray(storyOwner.users) ? storyOwner.users[0] : storyOwner.users;
        if (user && user.email) {
          const topMatchesForEmail = matchResults.slice(0, 5).map(m => {
            const journalist = journalists.find(j => j.id === m.journalistId);
            return {
              name: m.name,
              score: m.score,
              outlet: journalist?.outlet
            };
          });
          
          import('../notify').then(({ notifyClientMatch, notifyJournalistNewMatch }) => {
            // Notifica o cliente
            notifyClientMatch(user.email, user.name, storyOwner.title, topMatchesForEmail).catch(err => {
              console.error('[MATCH] Erro ao notificar cliente sobre match:', err);
            });

            // Notifica cada jornalista do match (com o link da pauta)
            const publicStoryUrl = process.env.FRONTEND_URL 
              ? `${process.env.FRONTEND_URL}/pauta/${input.storyId}`
              : `https://mariapress.com.br/pauta/${input.storyId}`;

            matchResults.forEach(m => {
              const journalist = journalists.find(j => j.id === m.journalistId);
              if (journalist && journalist.email) {
                notifyJournalistNewMatch(journalist.email, journalist.name, storyOwner.title, publicStoryUrl).catch(err => {
                  console.error('[MATCH] Erro ao notificar jornalista:', err);
                });
              }
            });
          });
        }
      }

      return {
        ok: true,
        matches: matchResults.length,
        top3: matchResults.slice(0, 3).map(m => `${m.name} (${m.score}%)`)
      };
    }),

  // Lista matches de uma story
  listByStory: adminProcedure
    .input(z.object({ storyId: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('matches')
        .select('*, users!journalistId(name, email, outlet, tags)')
        .eq('storyId', input.storyId)
        .order('createdAt', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }),
});
