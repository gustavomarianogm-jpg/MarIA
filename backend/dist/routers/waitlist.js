"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitlistRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const supabase_1 = require("../supabase");
exports.waitlistRouter = (0, trpc_1.router)({
    // Adiciona um inscrito
    add: trpc_1.publicProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string().min(2, "Nome muito curto"),
        email: zod_1.z.string().email("E-mail inválido"),
        segment: zod_1.z.string().optional()
    }))
        .mutation(async ({ input }) => {
        const { name, email, segment } = input;
        const { data, error } = await supabase_1.supabase
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
    registerJournalist: trpc_1.publicProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string().min(2, 'Nome muito curto'),
        email: zod_1.z.string().email('E-mail inválido'),
        outlet: zod_1.z.string().min(2, 'Veículo é obrigatório'),
        tags: zod_1.z.array(zod_1.z.string()).min(1, 'Selecione pelo menos uma editoria'),
        city: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
    }))
        .mutation(async ({ input }) => {
        // Verifica se e-mail já existe
        const { data: existing } = await supabase_1.supabase
            .from('users')
            .select('id')
            .eq('email', input.email.trim().toLowerCase())
            .single();
        if (existing) {
            return { ok: true, duplicate: true, message: 'E-mail já cadastrado.' };
        }
        const { data, error } = await supabase_1.supabase
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
