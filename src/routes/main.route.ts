import { Router } from 'express';

import { MainController } from '../controllers/main.controller';

/**
 * Router configuration for main endpoint
 */
class MainRoute {
  public router: Router;

  constructor() {
    this.router = Router();

    this.routes();
  }

  routes(): void {
    const prefix = '';

    this.router.get(`${prefix}/`, MainController.welcome);

    this.router.get(`${prefix}/auth/callback`, MainController.authCallback);

    this.router.get(`${prefix}/auth/url`, MainController.getAuthorizeURL);

    this.router.post(`${prefix}/users/lookup`, MainController.lookupUser);
  }
}

export { MainRoute };
