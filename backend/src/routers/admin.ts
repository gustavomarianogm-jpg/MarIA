import { z } from 'zod';
import { router, adminProcedure } from '../trpc';
import { supabase } from '../supabase';
import { notifyCuradoria } from '../notify';

export const adminRouter = router({
  // ═══════════════════════════════════════════
  // STORIES (Curadoria)
  // ═══════════════════════════════════════════

  // Lista todas as stories em review (painel de curadoria)
  listStories: adminProcedure
    .input(z.object({
      status: z.enum(['review', 'approved', 'rejected', 'sent', 'draft']).optional()
    }).optional())
    .query(async ({ input }) => {
      const statusFilter = input?.status || 'review';

      const { data, error } = await supabase
        .from('stories')
        .select('*, users!inner(name, email)')
        .eq('status', statusFilter)
        .order('createdAt', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }),

  // Busca uma story completa com conversa e mensagens
  getStoryById: adminProcedure
    .input(z.object({ storyId: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data: story, error } = await supabase
        .from('stories')
        .select('*, users!inner(name, email), conversations(*, messages(*))')
        .eq('id', input.storyId)
        .single();

      if (error) throw new Error(error.message);
      return story;
    }),

  // Aprova uma story
  approveStory: adminProcedure
    .input(z.object({ storyId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from('stories')
        .update({ status: 'approved' })
        .eq('id', input.storyId);

      if (error) throw new Error(error.message);
      return { ok: true };
    }),

  // Rejeita uma story com feedback
  rejectStory: adminProcedure
    .input(z.object({
      storyId: z.string().uuid(),
      feedback: z.string().min(5, 'O feedback precisa ter pelo menos 5 caracteres.')
    }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from('stories')
        .update({ status: 'rejected' })
        .eq('id', input.storyId);

      if (error) throw new Error(error.message);

      // Notifica o cliente sobre a rejeição (fire-and-forget)
      const { data: story } = await supabase
        .from('stories')
        .select('title, users!inner(name, email)')
        .eq('id', input.storyId)
        .single();

      if (story) {
        console.log(`[ADMIN] Pauta "${story.title}" rejeitada. Feedback: ${input.feedback}`);
      }

      return { ok: true };
    }),

  // Edita title/content de uma story
  editStory: adminProcedure
    .input(z.object({
      storyId: z.string().uuid(),
      title: z.string().min(3).optional(),
      content: z.string().min(10).optional(),
    }))
    .mutation(async ({ input }) => {
      const updates: Record<string, string> = {};
      if (input.title) updates.title = input.title;
      if (input.content) updates.content = input.content;

      const { error } = await supabase
        .from('stories')
        .update(updates)
        .eq('id', input.storyId);

      if (error) throw new Error(error.message);
      return { ok: true };
    }),

  // ═══════════════════════════════════════════
  // JORNALISTAS (CRUD para Matchmaking)
  // ═══════════════════════════════════════════

  // Lista jornalistas cadastrados
  listJournalists: adminProcedure.query(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'journalist')
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }),

  // Cria um jornalista
  createJournalist: adminProcedure
    .input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      outlet: z.string().min(2),
      beat: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      tags: z.array(z.string()).optional()
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: input.name,
          email: input.email.toLowerCase(),
          role: 'journalist',
          outlet: input.outlet,
          beat: input.beat || null,
          city: input.city || null,
          state: input.state || null,
          tags: input.tags || []
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('E-mail já cadastrado.');
        }
        throw new Error(error.message);
      }
      return data;
    }),

  // Atualiza jornalista (tags, outlet, etc)
  updateJournalist: adminProcedure
    .input(z.object({
      journalistId: z.string().uuid(),
      name: z.string().min(2).optional(),
      outlet: z.string().optional(),
      beat: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      tags: z.array(z.string()).optional()
    }))
    .mutation(async ({ input }) => {
      const { journalistId, ...updates } = input;
      // Remove campos undefined
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );

      const { error } = await supabase
        .from('users')
        .update(cleanUpdates)
        .eq('id', journalistId)
        .eq('role', 'journalist');

      if (error) throw new Error(error.message);
      return { ok: true };
    }),

  // Remove jornalista
  deleteJournalist: adminProcedure
    .input(z.object({ journalistId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', input.journalistId)
        .eq('role', 'journalist');

      if (error) throw new Error(error.message);
      return { ok: true };
    }),
});
