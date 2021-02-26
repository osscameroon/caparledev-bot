import http from 'http';
import express from 'express';

import { IAccount } from './types/models';

import {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_SECRET,
  BOT_TWITTER_NAME,
  CONSUMER_KEY,
  CONSUMER_SECRET,
  SERVER_PORT,
} from './config/env';
import { logger } from './config/logger';
import { dbConnection } from './config/dabatase';
import { setupRoutes } from './routes';
import { AccountModel } from './models/account.model';
import { TwitterService } from './services/twitter.service';
import { MainController } from './controllers/main.controller';

const app = express();

setupRoutes(app);

const server = http.createServer(app);

server.listen(
  SERVER_PORT,
  async (): Promise<void> => {
    // Initialize Twitter application
    TwitterService.init(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET);

    // Initialize connection to Mongo database
    await dbConnection();

    // Initialize connection to Redis database
    // Redis.init(config.REDIS_HOST, config.REDIS_PORT);

    //
    const account: IAccount | null = await AccountModel.findOne({ accountName: BOT_TWITTER_NAME });

    if (account) {
      TwitterService.setAccountClient(account.accessToken, account.accessTokenSecret);

      // Initialize Tweet Stream
      await MainController.stream();

      // Start the daemon to retweet tweets that failed
      // MainController.retweetMonitor();
    } else {
      logger.error('No account registered! Unable to stream the data!');
    }

    logger.info(`Server started - ${SERVER_PORT}`);
  },
);
