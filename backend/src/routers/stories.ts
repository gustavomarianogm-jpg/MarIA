import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
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
});
