import {
  CreateExpressContextOptions,
  createExpressMiddleware,
} from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';

import { appRouter } from './trpc/routers';
import { createTRPCContext } from './trpc/trpc';

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }: CreateExpressContextOptions) => {
      return {
        req,
        res,
        ...createTRPCContext(),
      };
    },
  }),
);

app.listen(5010, () => console.log('Server started on port 3000'));
