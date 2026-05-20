import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { supabase } from '../supabase';

export const waitlistRouter = router({
  // Adiciona um inscrito
  add: publicProcedure
    .input(z.object({
      name: z.string().min(2, "Nome muito curto"),
      email: z.string().email("E-mail inválido"),
      segment: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      const { name, email, segment } = input;
      
      const { data, error } = await supabase
        .from('waitlist')
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          segment: segment?.trim() || 'Não informado',
          status: 'confirmed'
        })
        .select()
        .single();
        
      if (error) {
        if (error.code === '23505') {
          return { ok: true, duplicate: true, message: 'E-mail já cadastrado.' };
        }
        throw new Error(error.message);
      }
      
      return { ok: true, data };
    }),
});
