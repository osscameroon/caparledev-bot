import mongoose, { ConnectionOptions } from 'mongoose';

import { DB_CONNECTION_SUCCESS } from '../utils/constants';
import { logger } from './logger';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './env';

mongoose.Promise = global.Promise;

/**
 * Create the connection to the database
 */
const dbConnection = async () => {
  const options: ConnectionOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, options);

  logger.info(DB_CONNECTION_SUCCESS);
};

export { dbConnection };
