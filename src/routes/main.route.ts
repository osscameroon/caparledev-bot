import { Router } from 'express';

import * as mainController from '../controllers/main.controller';

/**
 * Router configuration for endpoint
 */
const mainRoutes = () => {
  const router = Router();

  const prefix = '';

  router.get(`${prefix}/`, mainController.welcome);

  router.get(`${prefix}/auth/callback`, mainController.handleUserAuthenticationCallback);

  router.get(`${prefix}/auth/url`, mainController.generateAuthorizeURL);

  router.get(`${prefix}/users/:screenName/lookup`, mainController.findUserByScreenName);

  return router;
};

export { mainRoutes };
