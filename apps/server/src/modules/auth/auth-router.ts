import { TRPCError } from '@trpc/server';
import * as argon from 'argon2';
import { z } from 'zod';

import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../../configs';
import { redisClient } from '../../database';
import { exclude, signJwt, signTokens, verifyJwt } from '../../services';
import { protectedProcedure, publicProcedure, router } from '../../trpc';

export const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  login: publicProcedure
    .input(z.object({ password: z.string().min(6).max(256), name: z.string().min(1).max(256) }))
    .query(async ({ ctx, input: { name, password } }) => {
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
    const refresh_token = ctx.req.cookies?.refresh_token;

    const message = 'Could not refresh access token';
    if (!refresh_token) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    const decoded = verifyJwt<{ sub: string }>(refresh_token, 'REFRESH_TOKEN_PUBLIC_KEY');

    if (!decoded) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    const session = await redisClient.get(decoded.sub);
    if (!session) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    const user = await ctx.prisma.user.findUnique({ where: { id: JSON.parse(session).id } });

    if (!user) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    const access_token = signJwt({ sub: user.id }, 'ACCESS_TOKEN_PRIVATE_KEY', {
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
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
    .input(z.object({ password: z.string().min(6).max(256), name: z.string().min(1).max(256) }))
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
