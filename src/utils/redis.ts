import Redis from 'ioredis';
import IORedis from 'ioredis';

import { REDIS_HOST, REDIS_PORT } from '../config/env';

class RedisClient {
  private static client: IORedis.Redis;

  static instance() {
    if (!RedisClient.client) {
      RedisClient.client = new Redis({ host: REDIS_HOST, port: REDIS_PORT });
    }

    return RedisClient.client;
  }
}

export { RedisClient };
