import http from 'http';
import express from 'express';

import { SERVER_PORT } from './config/env';
import { logger } from './config/logger';
import { dbConnection } from './config/dabatase';
import { setupRoutes } from './routes';
import { startHashtagStream } from './controllers/main.controller';
import { RedisClient } from './utils/redis';

const app = express();

setupRoutes(app);

const server = http.createServer(app);

server.listen(SERVER_PORT, async () => {
  await dbConnection();

  RedisClient.instance();

  startHashtagStream();

  logger.info(`Server started - ${SERVER_PORT}`);
});
