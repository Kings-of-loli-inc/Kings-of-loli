import { initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { prisma } from './database';
import { isAuthorized } from './middlewares';
import { getHeaderUser } from './services/tokens';

const createInnerTRPCContext = async ({ req, res }: CreateExpressContextOptions) => {
  return {
    prisma,
    user: await getHeaderUser({ req, res }),
  };
};

export const createTRPCContext = async ({ req, res }: CreateExpressContextOptions) => {
  return {
    req,
    res,
    ...(await createInnerTRPCContext({ req, res })),
  };
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  isDev: true,
});

export const middleware = t.middleware;

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthorized);
