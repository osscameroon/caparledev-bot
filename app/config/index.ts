import dotenv from 'dotenv';

dotenv.config();

const e: any = process.env;

const ENV: string = e.NODE_ENV;
const SERVER_PORT: number = parseInt(e.SERVER_PORT || '7432', 10);
const { LOG_FILE_DIR } = e;
const CONSUMER_KEY: string = e.TWITTER_CONSUMER_KEY || '';
const CONSUMER_SECRET: string = e.TWITTER_CONSUMER_SECRET;
const ACCESS_TOKEN_KEY: string = e.TWITTER_ACCESS_TOKEN_KEY;
const ACCESS_TOKEN_SECRET: string = e.TWITTER_ACCESS_TOKEN_SECRET;
const { ACTIVITY_ACCOUNT_BASE_URL } = e;
const { ENVIRONMENT_NAME } = e;
const { BEARER_ACCESS_TOKEN } = e;
const { TWITTER_CALLBACK_URL } = e;
const { DB_HOST } = e;
const DB_PORT: number = parseInt(e.DB_PORT, 10);
const { DB_NAME } = e;
const { DB_USER } = e;
const { DB_PASSWORD } = e;
const { BOT_TWITTER_NAME } = e;
const { HASHTAG_TO_TRACK } = e;
const { REDIS_HOST } = e;
const REDIS_PORT: number = parseInt(e.REDIS_PORT, 10);

export {
  ENV,
  SERVER_PORT,
  LOG_FILE_DIR,
  CONSUMER_KEY,
  CONSUMER_SECRET,
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_SECRET,
  ACTIVITY_ACCOUNT_BASE_URL,
  ENVIRONMENT_NAME,
  BEARER_ACCESS_TOKEN,
  TWITTER_CALLBACK_URL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  BOT_TWITTER_NAME,
  HASHTAG_TO_TRACK,
  REDIS_HOST,
  REDIS_PORT,
};
