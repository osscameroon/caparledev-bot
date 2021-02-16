import { NextFunction, Request } from 'express';

import { CustomResponse } from '../types';

import { logger } from './logger';
import { Redis } from '../utils/redis';

const cacheMiddleware: any = async (req: Request, res: CustomResponse, next: NextFunction): Promise<void> => {
		const key: string =  `cpd__express__${req.originalUrl || req.url}`;
		const cacheContent: string|null = await Redis.get(key);

		if (cacheContent) {
			res.json(JSON.parse(cacheContent));
		}

		res.sendResponse = res.json;

		res.json = (body: any): any => {
			Redis.set(key, JSON.stringify(body), 30 * 1000).then(() => {
				res.sendResponse(body);
			}).catch((error: any): void => {
				logger.error(error);

				res.sendResponse([]);
			});
		};

		next();
};

export { cacheMiddleware };
