import path from 'node:path';

import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const environmentConfigs = {
  dbUri: process.env.DATABASE_URL ?? '',
  env: process.env.NODE_ENV ?? 'development',
  backendPort: process.env.PORT ?? '5520',
  fronendUri: process.env.ORIGIN ?? 'http://localhost:3000',
  accessTokeNExpiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) ?? 15,
  refreshTokenExpiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) ?? 15,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY ?? '',
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY ?? '',
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY ?? '',
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY ?? '',
  redisCacheExpiresIn: Number(process.env.REDIS_CACHE_EXPIRES_IN) ?? 60,
};
