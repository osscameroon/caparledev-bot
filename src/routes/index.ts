import * as express from 'express';
import cors from 'cors';

import { MainRoute } from './main.route';

/**
 * Global router configuration of the application
 */
const setupRoutes = (app: express.Application) => {
  // Express middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  // Endpoints
  app.use('/', new MainRoute().router);
};

export { setupRoutes };
