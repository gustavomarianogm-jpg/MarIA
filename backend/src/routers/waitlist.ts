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

  // Cadastra jornalista diretamente (público, sem login)
  registerJournalist: publicProcedure
    .input(z.object({
      name: z.string().min(2, 'Nome muito curto'),
      email: z.string().email('E-mail inválido'),
      outlet: z.string().min(2, 'Veículo é obrigatório'),
      tags: z.array(z.string()).min(1, 'Selecione pelo menos uma editoria'),
      city: z.string().optional(),
      state: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Verifica se e-mail já existe
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', input.email.trim().toLowerCase())
        .single();

      if (existing) {
        return { ok: true, duplicate: true, message: 'E-mail já cadastrado.' };
      }

      const { data, error } = await supabase
        .from('users')
        .insert({
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          role: 'journalist',
          outlet: input.outlet.trim(),
          tags: input.tags.map(t => t.toLowerCase()),
          city: input.city?.trim() || null,
          state: input.state?.trim() || null,
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
