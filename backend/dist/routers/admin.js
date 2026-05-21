"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const supabase_1 = require("../supabase");
const notify_1 = require("../notify");
exports.adminRouter = (0, trpc_1.router)({
    // ═══════════════════════════════════════════
    // STORIES (Curadoria)
    // ═══════════════════════════════════════════
    // Lista todas as stories em review (painel de curadoria)
    listStories: trpc_1.adminProcedure
        .input(zod_1.z.object({
        status: zod_1.z.enum(['review', 'approved', 'rejected', 'sent', 'draft']).optional()
    }).optional())
        .query(async ({ input }) => {
        const statusFilter = input?.status || 'review';
        const { data, error } = await supabase_1.supabase
            .from('stories')
            .select('*, users!inner(name, email)')
            .eq('status', statusFilter)
            .order('createdAt', { ascending: false });
        if (error)
            throw new Error(error.message);
        return data;
    }),
    // Busca uma story completa com conversa e mensagens
    getStoryById: trpc_1.adminProcedure
        .input(zod_1.z.object({ storyId: zod_1.z.string().uuid() }))
        .query(async ({ input }) => {
        const { data: story, error } = await supabase_1.supabase
            .from('stories')
            .select('*, users!inner(name, email), conversations(*, messages(*))')
            .eq('id', input.storyId)
            .single();
        if (error)
            throw new Error(error.message);
        return story;
    }),
    // Aprova uma story
    approveStory: trpc_1.adminProcedure
        .input(zod_1.z.object({ storyId: zod_1.z.string().uuid() }))
        .mutation(async ({ input }) => {
        const { error } = await supabase_1.supabase
            .from('stories')
            .update({ status: 'approved' })
            .eq('id', input.storyId);
        if (error)
            throw new Error(error.message);
        // Notifica o cliente sobre a aprovação
        const { data: story } = await supabase_1.supabase
            .from('stories')
            .select('title, users!inner(name, email)')
            .eq('id', input.storyId)
            .single();
        if (story) {
            // @ts-ignore
            const user = Array.isArray(story.users) ? story.users[0] : story.users;
            if (user && user.email) {
                (0, notify_1.notifyClientApproval)(user.email, user.name, story.title).catch(err => console.error('[ADMIN] Erro ao notificar aprovação:', err));
            }
        }
        return { ok: true };
    }),
    // Rejeita uma story com feedback
    rejectStory: trpc_1.adminProcedure
        .input(zod_1.z.object({
        storyId: zod_1.z.string().uuid(),
        feedback: zod_1.z.string().min(5, 'O feedback precisa ter pelo menos 5 caracteres.')
    }))
        .mutation(async ({ input }) => {
        const { error } = await supabase_1.supabase
            .from('stories')
            .update({ status: 'rejected' })
            .eq('id', input.storyId);
        if (error)
            throw new Error(error.message);
        // Notifica o cliente sobre a rejeição (fire-and-forget)
        const { data: story } = await supabase_1.supabase
            .from('stories')
            .select('title, users!inner(name, email)')
            .eq('id', input.storyId)
            .single();
        if (story) {
            // @ts-ignore
            const user = Array.isArray(story.users) ? story.users[0] : story.users;
            if (user && user.email) {
                (0, notify_1.notifyClientRejection)(user.email, user.name, story.title, input.feedback).catch(err => console.error('[ADMIN] Erro ao notificar rejeição:', err));
            }
            console.log(`[ADMIN] Pauta "${story.title}" rejeitada. Feedback: ${input.feedback}`);
        }
        return { ok: true };
    }),
    // Edita title/content de uma story
    editStory: trpc_1.adminProcedure
        .input(zod_1.z.object({
        storyId: zod_1.z.string().uuid(),
        title: zod_1.z.string().min(3).optional(),
        content: zod_1.z.string().min(10).optional(),
    }))
        .mutation(async ({ input }) => {
        const updates = {};
        if (input.title)
            updates.title = input.title;
        if (input.content)
            updates.content = input.content;
        const { error } = await supabase_1.supabase
            .from('stories')
            .update(updates)
            .eq('id', input.storyId);
        if (error)
            throw new Error(error.message);
        return { ok: true };
    }),
    // ═══════════════════════════════════════════
    // JORNALISTAS (CRUD para Matchmaking)
    // ═══════════════════════════════════════════
    // Lista jornalistas cadastrados
    listJournalists: trpc_1.adminProcedure.query(async () => {
        const { data, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('role', 'journalist')
            .order('name', { ascending: true });
        if (error)
            throw new Error(error.message);
        return data;
    }),
    // Cria um jornalista
    createJournalist: trpc_1.adminProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string().min(2),
        email: zod_1.z.string().email(),
        outlet: zod_1.z.string().min(2),
        beat: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional()
    }))
        .mutation(async ({ input }) => {
        const { data, error } = await supabase_1.supabase
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
    updateJournalist: trpc_1.adminProcedure
        .input(zod_1.z.object({
        journalistId: zod_1.z.string().uuid(),
        name: zod_1.z.string().min(2).optional(),
        outlet: zod_1.z.string().optional(),
        beat: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional()
    }))
        .mutation(async ({ input }) => {
        const { journalistId, ...updates } = input;
        // Remove campos undefined
        const cleanUpdates = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
        const { error } = await supabase_1.supabase
            .from('users')
            .update(cleanUpdates)
            .eq('id', journalistId)
            .eq('role', 'journalist');
        if (error)
            throw new Error(error.message);
        return { ok: true };
    }),
    // Remove jornalista
    deleteJournalist: trpc_1.adminProcedure
        .input(zod_1.z.object({ journalistId: zod_1.z.string().uuid() }))
        .mutation(async ({ input }) => {
        const { error } = await supabase_1.supabase
            .from('users')
            .delete()
            .eq('id', input.journalistId)
            .eq('role', 'journalist');
        if (error)
            throw new Error(error.message);
        return { ok: true };
    }),
});
