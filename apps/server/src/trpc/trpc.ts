import { initTRPC } from '@trpc/server';

import { prisma } from '../../src/database/prisma';

const createInnerTRPCContext = () => {
  return {
    prisma,
  };
};

export const createTRPCContext = () => {
  return createInnerTRPCContext();
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  isDev: true,
});
