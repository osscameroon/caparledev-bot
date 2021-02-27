import http from 'http';
import express from 'express';

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
import { Account, AccountDocument } from './models/account.model';
import { TwitterService } from './services/twitter.service';
import { startHashtagStream } from './controllers/main.controller';
import { redis } from './utils/redis';

const app = express();

setupRoutes(app);

const server = http.createServer(app);

server.listen(SERVER_PORT, async () => {
  await dbConnection();
  redis();

  TwitterService.init(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET);

  const account: AccountDocument | null = await Account.findOne({ accountName: BOT_TWITTER_NAME });

  if (account) {
    TwitterService.setAccountClient(account.accessToken, account.accessTokenSecret);

    startHashtagStream();
  } else {
    logger.error('No account registered! Unable to stream the data!');
  }

  logger.info(`Server started - ${SERVER_PORT}`);
});
