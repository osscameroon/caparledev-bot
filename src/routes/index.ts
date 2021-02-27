import * as express from 'express';
import cors from 'cors';

import { mainRoutes } from './main.route';

/**
 * Global router configuration of the application
 */
const setupRoutes = (app: express.Application) => {
  // Express middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  // routes
  app.use('/', mainRoutes());
};

export { setupRoutes };
