import dotenv from 'dotenv';

dotenv.config();

const e: any = process.env;

const ENV: string = e.NODE_ENV;
const SERVER_PORT = parseInt(e.SERVER_PORT || '7432', 10);
const LOG_FILE_DIR = e.LOG_FILE_DIR || '';
const APP_CONSUMER_KEY = e.TWITTER_APP_CONSUMER_KEY || '';
const APP_CONSUMER_SECRET = e.TWITTER_APP_CONSUMER_SECRET;
const APP_ACCESS_TOKEN_KEY = e.TWITTER_APP_ACCESS_TOKEN_KEY;
const APP_ACCESS_TOKEN_SECRET = e.TWITTER_APP_ACCESS_TOKEN_SECRET;
const APP_BEARER_TOKEN = e.TWITTER_APP_BEARER_TOKEN;
const BOT_ACCESS_TOKEN_KEY = e.TWITTER_BOT_ACCESS_TOKEN_KEY;
const BOT_ACCESS_TOKEN_SECRET = e.TWITTER_BOT_ACCESS_TOKEN_SECRET;
const ENABLE_STREAM = e.ENABLE_STREAM === 'true';
const TWITTER_CALLBACK_URL = e.TWITTER_CALLBACK_URL || '';
const DB_HOST = e.DB_HOST || '';
const DB_PORT = parseInt(e.DB_PORT, 10);
const DB_NAME = e.DB_NAME || '';
const DB_USER = e.DB_USER || '';
const DB_PASSWORD = e.DB_PASSWORD || '';
const HASHTAG_TO_TRACK = e.HASHTAG_TO_TRACK || '';

export {
  ENV,
  SERVER_PORT,
  LOG_FILE_DIR,
  APP_CONSUMER_KEY,
  APP_CONSUMER_SECRET,
  APP_ACCESS_TOKEN_KEY,
  APP_ACCESS_TOKEN_SECRET,
  APP_BEARER_TOKEN,
  BOT_ACCESS_TOKEN_KEY,
  BOT_ACCESS_TOKEN_SECRET,
  ENABLE_STREAM,
  TWITTER_CALLBACK_URL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  HASHTAG_TO_TRACK,
};
