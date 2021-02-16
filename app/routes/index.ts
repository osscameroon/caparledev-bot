import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { RegistrationRoute } from './registration.route';
import { AccountActivityRoute } from './account-activity.route';
import { MainRoute } from './main.route';

/**
 * Global router configuration of the application
 *
 * @class
 */
class Routes {
	/**
	 * @param  {Application} app
	 *
	 * @returns void
	 */
	static init(app: express.Application): void {
		// Express middleware
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		app.use(cookieParser());
		app.use(cors());

		// Endpoints
		app.use('/', new AccountActivityRoute().router);
		app.use('/', new MainRoute().router);
		app.use('/', new RegistrationRoute().router);

		// Static content
		app.use(express.static(path.join(__dirname, '../../public')));
	}
}

export { Routes };
