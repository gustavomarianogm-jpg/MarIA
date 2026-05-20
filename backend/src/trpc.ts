import { initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { supabase } from './supabase';
import { waitlistRouter } from './routers/waitlist';
import { userRouter } from './routers/user';
import { storiesRouter } from './routers/stories';
import { chatRouter } from './routers/chat';
import { adminRouter } from './routers/admin';
import { matchmakingRouter } from './routers/matchmaking';

export const createContext = async ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  const authHeader = req.headers.authorization;
  let user = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const { data: { user: supaUser }, error } = await supabase.auth.getUser(token);
    if (supaUser && !error) {
      user = supaUser;
    }
  }

  return { req, res, user };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { user: ctx.user },
  });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Verifica se o usuário tem role 'admin' no banco
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', ctx.user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Acesso restrito a administradores.' });
  }

  return next({ ctx });
});

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date() };
  }),
  waitlist: waitlistRouter,
  user: userRouter,
  stories: storiesRouter,
  chat: chatRouter,
  admin: adminRouter,
  matchmaking: matchmakingRouter,
});

export type AppRouter = typeof appRouter;
