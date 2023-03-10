import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { appRouter } from './modules/router';
import { createTRPCContext } from './trpc';

const app = express();

app.use(cookieParser());
app.use(cors({ origin: process.env.ORIGIN }));

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  }),
);

app.listen(process.env.PORT, () => console.log('Server started on port 3000'));
