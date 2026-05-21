"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storiesRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const supabase_1 = require("../supabase");
exports.storiesRouter = (0, trpc_1.router)({
    list: trpc_1.protectedProcedure.query(async ({ ctx }) => {
        const { data: stories, error } = await supabase_1.supabase
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
    getPublic: trpc_1.publicProcedure
        .input(zod_1.z.object({ storyId: zod_1.z.string().uuid() }))
        .query(async ({ input }) => {
        const { data, error } = await supabase_1.supabase
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
