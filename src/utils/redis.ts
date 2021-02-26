import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from '../config/env';

const redis = () => {
  return new Redis({ host: REDIS_HOST, port: REDIS_PORT });
};

export { redis };
