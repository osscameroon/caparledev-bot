import { SERVER_PORT } from '../config/env';

export const DB_CONNECTION_SUCCESS = 'Connected to Mongo successfully!';
export const RATE_LIMIT_CODE = 88;
export const ALREADY_RETWEETED_CODE = 327;
export const TEMPORARY_OAUTH_TOKEN_SETTING_KEY = 'temporaryOauthToken';
export const WELCOME_MESSAGE = 'Welcome to Caparledev Bot';
export const OAUTH_TOKEN_MISSING_ERROR = 'The oauth token or oauth verifier is missing!';
export const INVALID_OAUTH_TOKEN = "The oauth token doesn't match!";
export const STREAMING_API_RUNNING = (hashtagToTrack: string) => `You are now streaming hashtag ${hashtagToTrack}`;
export const BEARER_TOKEN_RESPONSE = (bearerToken: string) => `Your bearer token is: ${bearerToken}`;
export const STREAM_TIMEOUT_MESSAGE = 'A connection error occurred. Reconnecting…';
export const API_TWITTER_BASE_URL = 'https://api.twitter.com';
export const SERVER_STARTED_MESSAGE = `Server started - ${SERVER_PORT}`;
export const RATE_LIMIT_TIME_SETTING_KEY = 'rateLimitTimestamp';
export const NEXT_SEARCH_TOKEN_SETTING_KEY = 'nextSearchToken';
