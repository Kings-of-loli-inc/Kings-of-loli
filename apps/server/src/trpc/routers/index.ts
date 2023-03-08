import { t } from '../trpc';
import { userRouter } from './users';

export const appRouter = t.router({
  users: userRouter,
});

export type AppRouter = typeof appRouter;
