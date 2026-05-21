import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { router, publicProcedure, createContext } from './trpc';
import { waitlistRouter } from './routers/waitlist';
import { userRouter } from './routers/user';
import { storiesRouter } from './routers/stories';
import { chatRouter } from './routers/chat';
import { adminRouter } from './routers/admin';
import { matchmakingRouter } from './routers/matchmaking';
import { journalistRouter } from './routers/journalist';

// Monta o appRouter AQUI, depois que todos os módulos já foram carregados
// Isso evita dependência circular (trpc.ts importava os routers que importavam trpc.ts)
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
  journalist: journalistRouter,
});

export type AppRouter = typeof appRouter;

const app = express();

// Permite chamadas do frontend no Vercel e do localhost
app.use(cors({ origin: '*' }));
app.use(express.json());

// tRPC endpoint
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get('/', (req, res) => {
  res.send('Backend MarIA executando (Express + tRPC)');
});

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
  });
}

// Exporta o app para o Vercel (Serverless)
export default app;
