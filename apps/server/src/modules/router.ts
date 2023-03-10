import { router } from '../trpc';
import { authRouter } from './auth';
import { userRouter } from './user';

export const appRouter = router({
  auth: authRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;
