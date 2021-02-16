import http, { Server } from 'http';
import express, { Application } from 'express';

import { IAccount } from './types/models';

import * as config from './config';
import { logger } from './config/logger';
import { dbConnection } from './config/dabatase';

import { Routes } from './routes';

import { Redis } from './utils/redis';

import { AccountModel } from './models/account.model';

import { TwitterService } from './services/twitter.service';
import { AccountActivityService } from './services/account-activity.service';

import { MainController } from './controllers/main.controller';

const port: number = config.SERVER_PORT;
const app: Application = express();

Routes.init(app);

const server: Server = http.createServer(app);

server.listen(port, async (): Promise<void> => {
	// Initialize Twitter application
	TwitterService.init(
		config.CONSUMER_KEY, config.CONSUMER_SECRET, config.ACCESS_TOKEN_KEY, config.ACCESS_TOKEN_SECRET,
	);

	// Initialize Twitter Account Activity Service
	AccountActivityService.init(
		config.CONSUMER_KEY, config.CONSUMER_SECRET, config.ACCESS_TOKEN_KEY, config.ACCESS_TOKEN_SECRET,
	);

	// Initialize connection to Mongo database
	await dbConnection(config.DB_HOST, config.DB_PORT, config.DB_NAME, config.DB_USER, config.DB_PASSWORD);

	// Initialize connection to Redis database
	Redis.init(config.REDIS_HOST, config.REDIS_PORT);

	//
	const account: IAccount|null = await AccountModel.findOne({ accountName: config.BOT_TWITTER_NAME });

	if (account) {
		TwitterService.setAccountClient(account.accessToken, account.accessTokenSecret);

		// Initialize Tweet Stream
		await MainController.stream();

		// Start the daemon to retweet tweets that failed
		MainController.retweetMonitor();
	} else {
		logger.error('No account registered! Unable to stream the data!');
	}

	logger.info(`Server started - ${port}`);
});
