import { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { exclude } from '.';
import { prisma, redisClient } from '../database';

export const signJwt = (
  payload: Object,
  key: 'ACCESS_TOKEN_PRIVATE_KEY' | 'REFRESH_TOKEN_PRIVATE_KEY',
  options: SignOptions = {},
) => {
  const tokenKey = process.env[key];
  if (!tokenKey) throw new Error('Can`t find key in env');
  const privateKey = Buffer.from(tokenKey, 'base64').toString('ascii');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = <T>(
  token: string,
  key: 'ACCESS_TOKEN_PUBLIC_KEY' | 'REFRESH_TOKEN_PUBLIC_KEY',
) => {
  try {
    const tokenKey = process.env[key];
    if (!tokenKey) throw new Error('Can`t find key in env');
    const publicKey = Buffer.from(tokenKey, 'base64').toString('ascii');
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const signTokens = async (user: Omit<User, 'password'>) => {
  redisClient.set(`${user.id}`, JSON.stringify(user), {
    EX: Number(process.env.REDIS_CACHE_EXPIRES_IN) * 60,
  });

  const access_token = signJwt({ sub: user.id }, 'ACCESS_TOKEN_PRIVATE_KEY', {
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
  });

  const refresh_token = signJwt({ sub: user.id }, 'REFRESH_TOKEN_PRIVATE_KEY', {
    expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}m`,
  });

  return { access_token, refresh_token };
};

export const getHeaderUser = async ({ req }: CreateExpressContextOptions) => {
  try {
    let access_token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return;
    }

    const decoded = verifyJwt<{ sub: string }>(access_token, 'ACCESS_TOKEN_PUBLIC_KEY');

    if (!decoded) {
      return;
    }

    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: JSON.parse(session).id } });

    if (!user) {
      return;
    }

    return exclude(user, ['password']);
  } catch (error: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
};
