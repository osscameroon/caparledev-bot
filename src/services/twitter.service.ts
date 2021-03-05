import Twitter, { RequestParams } from 'twitter';
import request, { RequestPromiseOptions } from 'request-promise';
import querystring from 'querystring';

import { RequestTokenResponse, TwitterError, UserAccessTokenResponse } from '../types/variables';
import {
  APP_ACCESS_TOKEN_KEY,
  APP_ACCESS_TOKEN_SECRET,
  APP_CONSUMER_KEY,
  APP_CONSUMER_SECRET,
  BOT_ACCESS_TOKEN_KEY,
  BOT_ACCESS_TOKEN_SECRET,
} from '../config/env';
import { logger } from '../config/logger';
import {
  API_TWITTER_BASE_URL,
  RATE_LIMIT_CODE,
  RATE_LIMIT_TIME_SETTING_KEY,
  TEMPORARY_OAUTH_TOKEN_SETTING_KEY,
} from '../utils/constants';
import { Setting } from '../models/setting.model';

const createApplicationClient = () => {
  return new Twitter({
    consumer_key: APP_CONSUMER_KEY,
    consumer_secret: APP_CONSUMER_SECRET,
    access_token_key: APP_ACCESS_TOKEN_KEY,
    access_token_secret: APP_ACCESS_TOKEN_SECRET,
  });
};

const createBotClient = () => {
  return new Twitter({
    consumer_key: APP_CONSUMER_KEY,
    consumer_secret: APP_CONSUMER_SECRET,
    access_token_key: BOT_ACCESS_TOKEN_KEY,
    access_token_secret: BOT_ACCESS_TOKEN_SECRET,
  });
};

/**
 * Login user with Twitter
 * Step 1:  Request temporary token for the next step.
 *
 */
const requestTemporaryToken = async (callbackUrl: string) => {
  const options: RequestPromiseOptions = {
    oauth: {
      callback: callbackUrl,
      consumer_key: APP_CONSUMER_KEY,
      consumer_secret: APP_CONSUMER_SECRET,
    },
    json: true, // Automatically stringifies the body to JSON
    resolveWithFullResponse: true,
  };

  return request.post('https://api.twitter.com/oauth/request_token', options);
};

/**
 * Login user with Twitter
 * Step 2: Build authorize URL with the temporary token retrieved in the callback URL implementation
 *
 * @param oauthToken
 */
const getAuthorizeURL = (oauthToken: string) => {
  return `${API_TWITTER_BASE_URL}/oauth/authenticate?force_login=true&oauth_token=${oauthToken}`;
};

/**
 * Login user with Twitter
 *
 * Generate authorize URL who will be sent to user to performs authentication in the browser
 * When successful, Twitter will sent a POST request to the callback URL containing in the body
 * the temporary token and oauth verifier.
 * The temporary token can be useful to do a matching with the previous generated
 * The oauth verifier will be used to request user access token and token secret
 * Callback URL is a route in your current application eg: http://localhost:4400/auth/callback
 *
 * @param callbackUrl
 */
const processAuthorization = async (callbackUrl: string) => {
  // Request temporary token
  const response = await requestTemporaryToken(callbackUrl);

  if (response.statusCode !== 200) {
    throw new Error(response.error);
  }

  const bodyParsed: RequestTokenResponse = querystring.parse(response.body) as any;

  // Store temporary token to performs matching with the token received through the callback URL
  Setting.create([{ key: TEMPORARY_OAUTH_TOKEN_SETTING_KEY, value: bodyParsed.oauth_token }]).then();

  return getAuthorizeURL(bodyParsed.oauth_token);
};

/**
 * This process is executed when Twitter sent a request to our callbackURL
 * We use the temporary token and the aouth verifier retrieved in body of the callback URL to request access token
 * We can use it to perform action on the user account (Eg: Tweet, Retweet, etc..)
 *
 * @param oauthToken
 * @param oauthVerifier
 */
const getUserAccessToken = async (oauthToken: string, oauthVerifier: string) => {
  const options: RequestPromiseOptions = {
    oauth: {
      token: oauthToken,
      verifier: oauthVerifier,
      consumer_key: APP_CONSUMER_KEY,
    },
    json: true,
    resolveWithFullResponse: true,
  };

  const response = await request.post(`${API_TWITTER_BASE_URL}/oauth/access_token`, options);

  return querystring.parse(response.body) as UserAccessTokenResponse;
};

/**
 * Get temporary token created for the user account login with Twitter
 */
const getTemporaryOauthToken = async () => {
  const setting = await Setting.findOne({ key: TEMPORARY_OAUTH_TOKEN_SETTING_KEY });

  if (setting) {
    return setting.value;
  }

  return null;
};

/**
 * When a request to Twitter API fails we need use this method to check if the fail is due to rate limit
 * If it's the case, store the tweetId and wait 15 min to retry the call
 */
const handleRetweetRateLimit = (error: any) => {
  // { "errors": [ { "code": 88, "message": "Rate limit exceeded" } ] }
  const obj: TwitterError = error;

  if (obj.errors && obj.errors[0].code === RATE_LIMIT_CODE) {
    const hoursToWait = 3 * 60 * 60 * 1000;
    const rateLimitExpireTimestamp = new Date().getTime() + hoursToWait;

    Setting.create([{ key: RATE_LIMIT_TIME_SETTING_KEY, value: rateLimitExpireTimestamp }]).then();
  }
};

/**
 * Retweet a tweet
 */
const retweet = (tweetId: string) => {
  return new Promise((resolve, reject) => {
    createBotClient().post(`statuses/retweet/${tweetId}`, (error) => {
      if (error) {
        logger.error(error);

        reject(error);
      }

      return resolve(true);
    });
  });
};

/**
 * Get user account information through his screenName
 */
const lookupUser = (screenName: string) => {
  const options: RequestParams = {
    screen_name: screenName,
  };

  return createApplicationClient().get('users/lookup', options);
};

export {
  processAuthorization,
  getUserAccessToken,
  getTemporaryOauthToken,
  handleRetweetRateLimit,
  retweet,
  lookupUser,
};
