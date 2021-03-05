import http from 'http';
import express from 'express';

import { SERVER_PORT } from './config/env';
import { logger } from './config/logger';
import { dbConnection } from './config/dabatase';
import { setupRoutes } from './routes';
import { startHashtagStream } from './controllers/main.controller';
import { SERVER_STARTED_MESSAGE } from './utils/constants';
import { startRetweetJob } from './utils/retweetJob';

const app = express();

setupRoutes(app);

const server = http.createServer(app);

server.listen(SERVER_PORT, async () => {
  await dbConnection();

  startHashtagStream().then();

  startRetweetJob();

  logger.info(SERVER_STARTED_MESSAGE);
});
