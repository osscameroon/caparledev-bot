import redis, { RedisClient } from 'redis';

import { REDIS_CONNECTION_SUCCESS } from './constants';
import { logger } from '../config/logger';

class Redis {
	private static client: RedisClient;
	private static redisHost: string;
	private static redisPort: number;

	public static init(redisHost: string, redisPort: number): void {
		Redis.redisHost = redisHost;
		Redis.redisPort = redisPort;

		Redis.client = redis.createClient(Redis.redisPort, Redis.redisHost);

		logger.info(REDIS_CONNECTION_SUCCESS);
	}

	public static getInstance(): RedisClient {
		if (!Redis.client) {
			Redis.client = redis.createClient(Redis.redisPort, Redis.redisHost);
		}

		return Redis.client;
	}

	public static get(key: string): Promise<string|null> {
		return new Promise<string|null>((resolve: any, reject: any): void => {
			Redis.getInstance().get(key, (error: Error|null, result: string) => {
				if (error) {
					reject(error);
				}
				resolve(result ? result : null);
			});
		});
	}

	public static async set(key: string, value: string, expire: number = -1): Promise<boolean> {
		if (expire > 0) {
			return await Redis.setWithExpire(key, value, expire);
		}

		return await Redis.setWithoutExpire(key, value);
	}

	private static setWithExpire(key: string, value: string, expire: number): Promise<boolean> {
		return new Promise((resolve: any, reject: any): any => {
			Redis.getInstance().setex(key, expire, value, (error: Error|null) => {
				if (error) {
					reject(error);
				}
				resolve(true);
			});
		});
	}

	private static setWithoutExpire(key: string, value: string): Promise<boolean> {
		return new Promise((resolve: any, reject: any): any => {
			Redis.getInstance().set(key, value, (error: Error|null) => {
				if (error) {
					reject(error);
				}
				resolve(true);
			});
		});
	}

	public static delete(key: string): Promise<boolean> {
		return new Promise((resolve: any, reject: any): any => {
			Redis.getInstance().del(key, (error: Error|null) => {
				if (error) {
					reject(error);
				}
				resolve(true);
			});
		});
	}

	public static keys(pattern: string): Promise<string[]> {
		return new Promise((resolve: any, reject: any): any => {
			Redis.getInstance().keys(pattern, (error: Error|null, result: string[]) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		});
	}

	public static getValues(keys: string[]): Promise<string[]> {
		return new Promise((resolve: any, reject: any): any => {
			Redis.getInstance().mget(keys, (error: Error|null, result: string[]) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		});
	}
}

export { Redis };
