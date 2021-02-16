import { Router } from 'express';

import { AccountActivityController } from '../controllers/account-activity.controller';
import { cacheMiddleware } from '../config/cache-middleware';

/**
 * Router configuration for main endpoint
 *
 * @class
 */
class AccountActivityRoute {
	public router: Router;

	constructor() {
		this.router = Router();

		this.routes();
	}

	routes(): void {
		const prefix: string = '';

		this.router.post(`${prefix}/webhooks/register`, AccountActivityController.registerWebhook);

		this.router.get(`${prefix}/webhooks/challenge`, AccountActivityController.challenge);

		this.router.get(`${prefix}/webhooks`, cacheMiddleware, AccountActivityController.getWebhooks);

		this.router.delete(`${prefix}/webhooks/:id`, AccountActivityController.deleteWebhook);

		this.router.put(`${prefix}/webhooks/:id`, AccountActivityController.triggerWebhookChallenge);

		this.router.post(`${prefix}/subscriptions`, AccountActivityController.createSubscription);

		this.router.delete(`${prefix}/subscriptions`, AccountActivityController.deleteSubscription);

		this.router.get(`${prefix}/subscriptions`, cacheMiddleware, AccountActivityController.getSubscriptions);
	}
}

export { AccountActivityRoute };
