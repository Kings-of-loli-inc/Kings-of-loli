import type { PrismaClient, User } from '@prisma/client';
import { initTRPC, TRPCError } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import * as argon from 'argon2';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';

import { accessTokenCookieOptions, environmentConfigs, refreshTokenCookieOptions } from './configs';
import { prisma, redisClient } from './database';
import { loginInput, registerInput } from './modules/auth';
import { deleteUser, getAllUsers, getUserById, updateUserInput } from './modules/user';
import { exclude } from './services';
import { getHeaderUser, signJwt, signTokens, verifyJwt } from './services/tokens';

export type TRPCContext = {
  req: Request;
  res: Response;
  user?: Omit<User, 'password'>;
  prisma: PrismaClient;
};

const createTRPCContext = async ({ req, res }: CreateExpressContextOptions) => {
  return {
    prisma,
    user: await getHeaderUser({ req, res }),
    req,
    res,
  } as TRPCContext;
};

export const t = initTRPC.context<typeof createTRPCContext>().create();

const router = t.router;
const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      });
    }
    return next();
  }),
);

export const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  login: publicProcedure.input(loginInput).query(async ({ ctx, input: { name, password } }) => {
    const user = await ctx.prisma.user.findUnique({ where: { name } });
    if (!user || !(await argon.verify(password, user.password))) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid name or password',
      });
    }

    const { access_token, refresh_token } = await signTokens(user);

    ctx.res.cookie('access_token', access_token, accessTokenCookieOptions);
    ctx.res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
    ctx.res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    return {
      user: exclude(user, ['password']),
      access_token,
    };
  }),
  logout: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    if (!user?.id) return false;
    await redisClient.del(user.id.toString());
    ctx.res.cookie('access_token', '', { maxAge: -1 });
    ctx.res.cookie('refresh_token', '', { maxAge: -1 });
    ctx.res.cookie('logged_in', '', {
      maxAge: -1,
    });
    return true;
  }),
  refreshToken: protectedProcedure.query(async ({ ctx }) => {
    const { refresh_token } = ctx.req.cookies as { refresh_token?: string };

    const message = 'Could not refresh access token';
    if (!refresh_token) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    const decoded = verifyJwt<{ sub: string }>(refresh_token, 'refreshTokenPublicKey');

    if (!decoded) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    const redisSession = await redisClient.get(decoded.sub);
    const session = redisSession ? (JSON.parse(redisSession) as Omit<User, 'password'>) : undefined;
    if (!session) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    const user = await ctx.prisma.user.findUnique({ where: { id: session.id } });

    if (!user) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
      expiresIn: `${environmentConfigs.accessTokenExpiresIn}m`,
    });

    ctx.res.cookie('access_token', access_token, accessTokenCookieOptions);
    ctx.res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    return {
      user,
      access_token,
    };
  }),
  register: publicProcedure
    .input(registerInput)
    .mutation(async ({ input: { name, password }, ctx }) => {
      const newUser = await ctx.prisma.user.create({
        data: {
          name: name.trim(),
          password: await argon.hash(password),
        },
      });
      return newUser;
    }),
});

export const userRouter = router({
  updateUser: protectedProcedure.input(updateUserInput).mutation(
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
  deleteUser: protectedProcedure.input(deleteUser).mutation(async ({ ctx, input: { userId } }) => {
    const deletedUser = await ctx.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return deletedUser.id;
  }),
  getUserById: publicProcedure.input(getUserById).query(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input.id,
      },
    });
    return user ? exclude(user, ['password']) : {};
  }),
  getAllUsers: publicProcedure
    .input(getAllUsers)
    .query(async ({ ctx, input: { limit, offset, orderBy } }) => {
      const users = await ctx.prisma.user.findMany({
        skip: offset,
        take: limit,
        orderBy: orderBy && {
          [orderBy.key]: orderBy.order,
        },
      });
      return users.map((user) => exclude(user, ['password']));
    }),
});

export const appRouter = router({
  auth: authRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;

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
