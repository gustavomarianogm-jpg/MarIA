"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const trpc_1 = require("../trpc");
const supabase_1 = require("../supabase");
exports.userRouter = (0, trpc_1.router)({
    me: trpc_1.protectedProcedure.query(async ({ ctx }) => {
        // Busca usuário e seu balanço de créditos usando inner join (ou duas chamadas)
        let { data: userProfile, error } = await supabase_1.supabase
            .from('users')
            .select('*, credits!inner(balance)')
            .eq('id', ctx.user.id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                // Usuário não encontrado, cria fallback
                // 1. Cria usuário
                const { data: newUser, error: userError } = await supabase_1.supabase
                    .from('users')
                    .insert({
                    id: ctx.user.id,
                    openId: ctx.user.id,
                    email: ctx.user.email,
                    name: ctx.user.user_metadata?.name || 'Jornalista',
                    role: 'journalist'
                })
                    .select()
                    .single();
                if (userError)
                    throw new Error('Erro ao criar usuário: ' + userError.message);
                // 2. Injeta créditos iniciais (default é 3 na schema)
                const { data: newCredits, error: creditError } = await supabase_1.supabase
                    .from('credits')
                    .insert({
                    userId: ctx.user.id,
                })
                    .select()
                    .single();
                if (creditError)
                    throw new Error('Erro ao criar carteira de créditos: ' + creditError.message);
                return { ...newUser, credits: newCredits.balance };
            }
            throw new Error(error.message);
        }
        // Retorna formatado para manter compatibilidade com o Frontend
        return { ...userProfile, credits: userProfile.credits?.balance || 0 };
    }),
});
