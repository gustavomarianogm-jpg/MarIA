"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.journalistRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const supabase_1 = require("../supabase");
exports.journalistRouter = (0, trpc_1.router)({
    // Jornalista registra interesse em uma pauta (sem login)
    acceptMatch: trpc_1.publicProcedure
        .input(zod_1.z.object({
        storyId: zod_1.z.string().uuid(),
        email: zod_1.z.string().email('E-mail inválido')
    }))
        .mutation(async ({ input }) => {
        // 1. Busca o jornalista pelo e-mail
        const { data: journalist, error: journalistError } = await supabase_1.supabase
            .from('users')
            .select('id, name, outlet')
            .eq('email', input.email)
            .eq('role', 'journalist')
            .single();
        if (journalistError || !journalist) {
            throw new Error('E-mail não encontrado na base de jornalistas. Cadastre-se primeiro.');
        }
        // 2. Verifica se existe um match pendente para essa story + jornalista
        const { data: existingMatch } = await supabase_1.supabase
            .from('matches')
            .select('id, status')
            .eq('storyId', input.storyId)
            .eq('journalistId', journalist.id)
            .single();
        if (existingMatch) {
            // Atualiza para "interested"
            await supabase_1.supabase
                .from('matches')
                .update({ status: 'interested', updatedAt: new Date().toISOString() })
                .eq('id', existingMatch.id);
        }
        else {
            // Cria um novo match com status "interested"
            await supabase_1.supabase
                .from('matches')
                .insert({
                storyId: input.storyId,
                journalistId: journalist.id,
                status: 'interested'
            });
        }
        // 3. Notifica o empreendedor (dono da pauta)
        const { data: story } = await supabase_1.supabase
            .from('stories')
            .select('title, users!inner(name, email)')
            .eq('id', input.storyId)
            .single();
        if (story) {
            // @ts-ignore
            const owner = Array.isArray(story.users) ? story.users[0] : story.users;
            if (owner && owner.email) {
                Promise.resolve().then(() => __importStar(require('../notify'))).then(({ notifyClientMatch }) => {
                    notifyClientMatch(owner.email, owner.name, story.title, [{
                            name: journalist.name,
                            score: 100,
                            outlet: journalist.outlet
                        }]).catch(err => {
                        console.error('[JOURNALIST] Erro ao notificar empreendedor:', err);
                    });
                });
                // Retorna os dados da fonte para o jornalista
                return {
                    ok: true,
                    message: 'Interesse registrado com sucesso!',
                    sourceContact: {
                        name: owner.name,
                        email: owner.email
                    }
                };
            }
        }
        return { ok: true, message: 'Interesse registrado com sucesso!' };
    }),
});
