import { Router } from 'express';

import { RegistrationController } from '../controllers/registration.controller';

/**
 * Router configuration for registration endpoint
 *
 * @class
 */
class RegistrationRoute {
	public router: Router;

	constructor() {
		this.router = Router();

		this.routes();
	}

	routes(): void {
		const prefix: string = '/registrations';

		this.router.get(`${prefix}/:id`, RegistrationController.getOneRegistration);

		this.router.delete(`${prefix}/:id`, RegistrationController.deleteRegistration);

		this.router.get(`${prefix}`, RegistrationController.getRegistrations);
	}
}

export { RegistrationRoute };
