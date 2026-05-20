import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, createContext } from './trpc';

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
