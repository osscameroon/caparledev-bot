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
  HASHTAG_TO_TRACK,
} from '../config/env';
import { logger } from '../config/logger';
import { RATE_LIMIT_CODE, TWEET_PREFIX_KEY } from '../utils/constants';
import { RedisClient } from '../utils/redis';

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
  return `https://api.twitter.com/oauth/authenticate?force_login=true&oauth_token=${oauthToken}`;
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
  RedisClient.instance()
    .multi()
    .set('tempOauthToken', bodyParsed.oauth_token)
    .set('tempOauthTokenSecret', bodyParsed.oauth_token_secret)
    .exec()
    .then();

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

  const response = await request.post('https://api.twitter.com/oauth/access_token', options);

  return querystring.parse(response.body) as UserAccessTokenResponse;
};

/**
 * Get user's account information through his authorize token
 */
const getUserInfo = (oauthToken: string) => {
  const options: RequestPromiseOptions = {
    oauth: {
      token: oauthToken,
      consumer_key: APP_CONSUMER_KEY,
    },
    json: true,
    resolveWithFullResponse: true,
  };

  return request.get('https://api.twitter.com/1.1/account/verify_credentials.json', options);
};

/**
 * Get temporary token created for the user account login with Twitter
 */
const getTemporaryOauthToken = async () => {
  return await RedisClient.instance().get('tempOauthToken');
};

/**
 * Reset Temporary token when the process of authentication with Twitter is completed
 */
const resetTemporaryToken = async () => {
  await RedisClient.instance().del('tempOauthToken', 'tempOauthTokenSecret');
};

/**
 * When a request to Twitter API fails we need use this method to check if the fail is due to rate limit
 * If it's the case, store the tweetId and wait 15 min to retry the call
 */
const handleRateLimit = (error: any, tweetId?: string) => {
  // { "errors": [ { "code": 88, "message": "Rate limit exceeded" } ] }
  const obj: TwitterError = error;

  if (obj.errors && obj.errors[0].code === RATE_LIMIT_CODE) {
    const now: Date = new Date();
    const minuteToWait: number = 15 * 60 * 1000;
    // minuteToWait * 1000 because the timestamp is in millisecond
    const whenTweetWillBePossible: number = now.getTime() + minuteToWait * 1000;

    console.log(whenTweetWillBePossible, tweetId, TWEET_PREFIX_KEY);
  }
};

/**
 * Retweet a tweet
 */
const retweet = (tweetId: string) => {
  createBotClient().post(`statuses/retweet/${tweetId}`, (error) => {
    if (error) {
      logger.error(error);

      handleRateLimit(error, tweetId);
    }
  });
};

/**
 * Use of Twitter Stream API listen for tweet with the hastag #caparledev and retweet them
 *
 * https://developer.twitter.com/en/docs/tweets/filter-realtime/api-reference/post-statuses-filter
 */
const initializeStream = () => {
  const stream = createApplicationClient().stream('statuses/filter', {
    track: HASHTAG_TO_TRACK,
  });

  stream.on('data', async (event: any) => {
    logger.info(event);

    if (!event.text.toLowerCase().includes(HASHTAG_TO_TRACK.toLowerCase())) {
      console.log('No Retweet!\n');

      return;
    }

    const tweetId: string = event.retweeted_status ? event.retweeted_status.id_str : event.id_str;

    retweet(tweetId);
  });

  stream.on('error', (error: any) => {
    logger.error('Stream Error!');
    logger.error(error);
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
  getUserInfo,
  getTemporaryOauthToken,
  resetTemporaryToken,
  initializeStream,
  lookupUser,
};
