import mongoose from 'mongoose';

import { DB_CONNECTION_SUCCESS } from '../utils/constants';
import { logger } from './logger';

mongoose.Promise = global.Promise;

/**
 * Create the connection to the database
 * @async
 *
 * @return Promise<void>
 */
const dbConnection: Function = async (
	dbHost: string, dbPort: number, dbName: string, dbUser: string, dbPassword: string,
): Promise<void> => {
	const options: object = {
		useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true,
	};

	try {
		await mongoose.connect(`mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`, options);
		logger.info(DB_CONNECTION_SUCCESS);
	} catch (err) {
		logger.error(err.stack);
	}
};

export { dbConnection };
