import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { SortOrder } from '../../interfaces/global-interfaces';
import { exclude } from '../../services';
import { protectedProcedure, publicProcedure, router } from '../../trpc';

export const userRouter = router({
  updateUser: protectedProcedure
    .input(
      z.object({
        userId: z.number().min(1),
        values: z.object({
          name: z.string().min(1).max(256).optional(),
          sound: z.number().min(0).max(100).optional(),
        }),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          userId,
          values: { name, sound },
        },
      }) => {
        const updatedUser = await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            sound: sound && Number(sound.toFixed(0)),
            name: name?.trim(),
          },
        });
        return exclude(updatedUser, ['password']);
      },
    ),
  deleteUser: protectedProcedure
    .input(
      z.object({
        userId: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { userId } }) => {
      const deletedUser = await ctx.prisma.user.delete({
        where: {
          id: userId,
        },
      });
      return deletedUser.id;
    }),
  getUserById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input.id,
      },
    });
    return user ? exclude(user, ['password']) : {};
  }),
  getAllUsers: publicProcedure
    .input(
      z.object({
        offset: z.number().min(0).default(0),
        limit: z.number().min(1).max(50).default(20),
        orderBy: z.object({
          key: z.nativeEnum(exclude(Prisma.UserScalarFieldEnum, ['password'])),
          order: z.nativeEnum(SortOrder),
        }),
      }),
    )
    .query(async ({ ctx, input: { limit, offset, orderBy } }) => {
      const users = await ctx.prisma.user.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          [orderBy.key]: orderBy.order,
        },
      });
      return users.map((user) => exclude(user, ['password']));
    }),
});
