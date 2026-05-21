"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.adminProcedure = exports.protectedProcedure = exports.publicProcedure = exports.router = exports.createContext = void 0;
const server_1 = require("@trpc/server");
const supabase_1 = require("./supabase");
const waitlist_1 = require("./routers/waitlist");
const user_1 = require("./routers/user");
const stories_1 = require("./routers/stories");
const chat_1 = require("./routers/chat");
const admin_1 = require("./routers/admin");
const matchmaking_1 = require("./routers/matchmaking");
const journalist_1 = require("./routers/journalist");
const createContext = async ({ req, res }) => {
    const authHeader = req.headers.authorization;
    let user = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data: { user: supaUser }, error } = await supabase_1.supabase.auth.getUser(token);
        if (supaUser && !error) {
            user = supaUser;
        }
    }
    return { req, res, user };
};
exports.createContext = createContext;
const t = server_1.initTRPC.context().create();
exports.router = t.router;
exports.publicProcedure = t.procedure;
exports.protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.user) {
        throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: { user: ctx.user },
    });
});
exports.adminProcedure = exports.protectedProcedure.use(async ({ ctx, next }) => {
    // Verifica se o usuário tem role 'admin' no banco
    const { data: profile } = await supabase_1.supabase
        .from('users')
        .select('role')
        .eq('id', ctx.user.id)
        .single();
    if (!profile || profile.role !== 'admin') {
        throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Acesso restrito a administradores.' });
    }
    return next({ ctx });
});
exports.appRouter = (0, exports.router)({
    healthcheck: exports.publicProcedure.query(() => {
        return { status: 'ok', timestamp: new Date() };
    }),
    waitlist: waitlist_1.waitlistRouter,
    user: user_1.userRouter,
    stories: stories_1.storiesRouter,
    chat: chat_1.chatRouter,
    admin: admin_1.adminRouter,
    matchmaking: matchmaking_1.matchmakingRouter,
    journalist: journalist_1.journalistRouter,
});
