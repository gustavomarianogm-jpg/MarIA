import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { supabase } from '../supabase';

export const storiesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data: stories, error } = await supabase
      .from('stories')
      .select('*')
      .eq('userId', ctx.user.id)
      .order('createdAt', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Mapeia para o frontend que espera created_at no layout atual
    return stories.map(s => ({
      ...s,
      created_at: s.createdAt,
    }));
  }),

  // Rota PÚBLICA para jornalistas verem pautas aprovadas (sem login)
  getPublic: publicProcedure
    .input(z.object({ storyId: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, content, category, targetCity, targetState, createdAt')
        .eq('id', input.storyId)
        .eq('status', 'approved')
        .single();

      if (error || !data) {
        throw new Error('Pauta não encontrada ou ainda em curadoria.');
      }

      return data;
    }),
});
