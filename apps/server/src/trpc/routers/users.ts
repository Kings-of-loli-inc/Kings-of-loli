import { z } from 'zod';

import { t } from '../trpc';

export const userRouter = t.router({
  createUser: t.procedure
    .input(z.object({ email: z.string().email() }))
    .mutation(({ input, ctx }) => {
      const newUser = ctx.prisma.user.create({
        data: {
          ...input,
          password: '13123',
        },
      });
      return newUser;
    }),
  getUser: t.procedure.input(z.object({ id: z.number() })).query(({ input, ctx }) => {
    const user = ctx.prisma.user.findUnique({
      where: {
        id: input.id,
      },
    });
    return { ...user, password: undefined };
  }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});
