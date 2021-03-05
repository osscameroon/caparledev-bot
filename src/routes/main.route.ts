import { Router } from 'express';

import * as mainController from '../controllers/main.controller';
import { searchTweet } from '../services/twitter.service';

/**
 * Router configuration for main endpoint
 */
const mainRoutes = () => {
  const router = Router();

  const prefix = '';

  router.get(`${prefix}/`, mainController.welcome);

  router.get(`${prefix}/auth/callback`, mainController.handleUserAuthenticationCallback);

  router.get(`${prefix}/auth/url`, mainController.generateAuthorizeURL);

  router.get(`${prefix}/users/:screenName/lookup`, mainController.findUserByScreenName);

  router.get('/search', async (_req, res) => {
    const result = await searchTweet();
    // const result = await processTweetFound(response);

    return res.json(result);
  });

  return router;
};

export { mainRoutes };
