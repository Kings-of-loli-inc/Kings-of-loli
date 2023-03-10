import { createClient } from 'redis';

const redisUrl = `redis://localhost:6379`;
const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('🚀 Redis client connected...');
  } catch (error: any) {
    console.log(error.message);
    throw new Error('Redis error');
  }
};

connectRedis();

redisClient.on('error', (error) => console.log(error));

export { redisClient };
