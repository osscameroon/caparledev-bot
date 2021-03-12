import mongoose, { ConnectionOptions } from 'mongoose';

import { DB_CONNECTION_SUCCESS } from '../utils/constants';
import { logger } from './logger';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, ENV } from './env';

mongoose.Promise = global.Promise;

const generateConnectionString = () => {
  if (ENV === 'production') {
    return `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
  }

  return `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
};

const connectToDatabase = async () => {
  const options: ConnectionOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };

  const connectionString = generateConnectionString();

  await mongoose.connect(connectionString, options);

  logger.info(DB_CONNECTION_SUCCESS);
};

export { connectToDatabase };
