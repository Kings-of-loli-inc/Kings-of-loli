import { TRPCError } from '@trpc/server';
import { middleware } from 'src/trpc';

export const isAuthorized = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next();
});
