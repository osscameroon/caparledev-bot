import Twitter, { RequestParams } from 'twitter';
import request from 'request-promise';
import querystring from 'querystring';

import { RequestTokenResponse, TwitterError } from '../types/variables';

import { HASHTAG_TO_TRACK } from '../config/env';
import { logger } from '../config/logger';

import { TWEET_PREFIX_KEY, TWIITTER_APP_INIT_SUCCESS } from '../utils/constants';

/**
 * This class is responsible to perform the requests needed for our application
 */
class TwitterService {
  private static appClient: Twitter;
  private static botClient: Twitter;

  private static consumerKey: string;
  private static consumerSecret: string;
  private static accessTokenKey: string;
  private static accessTokenSecret: string;

  private static tempOauthToken: string | undefined;
  private static tempOauthTokenSecret: string | undefined;

  private static stream: any;

  private static RATE_LIMIT_CODE = 88;
  // private static RATE_LIMIT_KEY = 'cpd_rate_limit';

  /**
   * Create an instance of Twitter client for application
   */
  public static init(
    consumerKey: string,
    consumerSecret: string,
    accessTokenKey: string,
    accessTokenSecret: string,
  ): void {
    TwitterService.consumerKey = consumerKey;
    TwitterService.consumerSecret = consumerSecret;
    TwitterService.accessTokenKey = accessTokenKey;
    TwitterService.accessTokenSecret = accessTokenSecret;

    TwitterService.getClient();

    logger.info(TWIITTER_APP_INIT_SUCCESS);
  }

  /**
   * Get instance of Twitter application
   */
  public static getClient(): Twitter {
    if (!TwitterService.appClient) {
      TwitterService.appClient = new Twitter({
        consumer_key: TwitterService.consumerKey,
        consumer_secret: TwitterService.consumerSecret,
        access_token_key: TwitterService.accessTokenKey,
        access_token_secret: TwitterService.accessTokenSecret,
      });
    }

    return TwitterService.appClient;
  }

  /**
   * Create an instance of Twitter appClient for bot account
   */
  public static setAccountClient(accessToken: string, accessTokenSecret: string): void {
    if (!TwitterService.botClient) {
      TwitterService.botClient = new Twitter({
        consumer_key: TwitterService.consumerKey,
        consumer_secret: TwitterService.consumerSecret,
        access_token_key: accessToken,
        access_token_secret: accessTokenSecret,
      });
    }
  }

  /**
   * Get instance of Twitter bot account
   */
  public static getAccountClient(): Twitter {
    return new Twitter({
      consumer_key: TwitterService.consumerKey,
      consumer_secret: TwitterService.consumerSecret,
      access_token_key: '1205602583227838465-v0Tuwx7rknEnH5CoeQKfrWaaINHuUR',
      access_token_secret: 'B3iuSCABDZV7girFFGRwbj5dwEG8oYrhinqVWbcIFtL0U',
    });
  }

  /**
   * Login user with Twitter
   * Step 1:  Request temporary token for the next step.
   *
   * @param callbackUrl
   */
  public static async requestToken(callbackUrl: string): Promise<any> {
    const options: any = {
      uri: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        callback: callbackUrl,
        consumer_key: TwitterService.consumerKey,
        consumer_secret: TwitterService.consumerSecret,
      },
      json: true, // Automatically stringifies the body to JSON
      resolveWithFullResponse: true,
    };

    return request.post(options);
  }

  /**
   * Login user with Twitter
   * Step 2: Build authorize URL with the temporary token retrieved in the callback URL implementation
   *
   * @param oauthToken
   */
  public static getAuthorizeURL(oauthToken: string): string {
    return `https://api.twitter.com/oauth/authenticate?force_login=true&oauth_token=${oauthToken}`;
  }

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
  public static async processAuthorization(callbackUrl: string): Promise<string> {
    // Request temporary token
    const response: any = await TwitterService.requestToken(callbackUrl);

    if (response.statusCode !== 200) {
      throw new Error(response.error);
    }

    const bodyParsed: RequestTokenResponse = querystring.parse(response.body) as any;

    // Store temporary token to performs matching with the token received through the callback URL
    TwitterService.tempOauthToken = bodyParsed.oauth_token;
    TwitterService.tempOauthTokenSecret = bodyParsed.oauth_token_secret;

    return TwitterService.getAuthorizeURL(bodyParsed.oauth_token);
  }

  /**
   * This process is executed when Twitter sent a request to our callbackURL
   * We use the temporary token and the aouth verifier retrieved in body of the callback URL to request access token
   * We can use it to perform action on the user account (Eg: Tweet, Retweet, etc..)
   *
   * @param oauthToken
   * @param oauthVerifier
   */
  public static async getUserAccessToken(oauthToken: string, oauthVerifier: string): Promise<any> {
    const options: any = {
      uri: 'https://api.twitter.com/oauth/access_token',
      oauth: {
        token: oauthToken,
        verifier: oauthVerifier,
        consumer_key: TwitterService.consumerKey,
      },
      json: true,
      resolveWithFullResponse: true,
    };

    const response: any = await request.post(options);

    return querystring.parse(response.body);
  }

  /**
   * Get user's account information through his authorize token
   *
   * @param oauthToken
   */
  public static async getUserInfo(oauthToken: string): Promise<any> {
    const options: any = {
      uri: 'https://api.twitter.com/1.1/account/verify_credentials.json',
      oauth: {
        token: oauthToken,
        consumer_key: TwitterService.consumerKey,
      },
      json: true,
      resolveWithFullResponse: true,
    };

    return request.get(options);
  }

  /**
   * Get temporary token created for the user account login with Twitter
   */
  public static getTempOauthToken(): string | undefined {
    return TwitterService.tempOauthToken;
  }

  /**
   * Get temporary token secret created for the user account login with Twitter
   */
  public static getTempOauthTokenSecret(): string | undefined {
    return TwitterService.tempOauthTokenSecret;
  }

  /**
   * Reset Temporary token when the process of authentication with Twitter is completed
   */
  public static resetTempToken(): void {
    TwitterService.tempOauthToken = undefined;
    TwitterService.tempOauthTokenSecret = undefined;
  }

  /**
   * When a request to Twitter API fails we need use this method to check if the fail is due to rate limit
   * If it's the case, store the tweetId and wait 15 min to retry the call
   *
   * @param error
   * @param tweetId
   */
  public static handleRateLimit(error: any, tweetId?: string): void {
    // { "errors": [ { "code": 88, "message": "Rate limit exceeded" } ] }
    const obj: TwitterError = error;

    if (obj.errors && obj.errors[0].code === TwitterService.RATE_LIMIT_CODE) {
      const now: Date = new Date();
      const minuteToWait: number = 15 * 60 * 1000;
      // minuteToWait * 1000 because the timestamp is in millisecond
      const whenTweetWillBePossible: number = now.getTime() + minuteToWait * 1000;

      console.log(whenTweetWillBePossible, tweetId, TWEET_PREFIX_KEY);
      /*Redis.set(TwitterService.RATE_LIMIT_KEY, whenTweetWillBePossible.toString(), minuteToWait);

      if (tweetId) {
        Redis.set(`${TWEET_PREFIX_KEY}${tweetId}`, tweetId);
      }*/
    }
  }

  /**
   * Retweet a tweet
   *
   * @param tweetId
   */
  public static async retweet(tweetId: string): Promise<void> {
    TwitterService.getAccountClient().post(`statuses/retweet/${tweetId}`, (error: any) => {
      if (error) {
        logger.error(error);

        TwitterService.handleRateLimit(error, tweetId);
      }
    });
  }

  /**
   * Use of Twitter Stream API listen for tweet with the hastag #caparledev and retweet them
   *
   * https://developer.twitter.com/en/docs/tweets/filter-realtime/api-reference/post-statuses-filter
   */
  public static initializeStream(): void {
    TwitterService.stream = TwitterService.appClient.stream('statuses/filter', {
      track: HASHTAG_TO_TRACK,
    });

    TwitterService.stream.on(
      'data',
      async (event: any): Promise<void> => {
        console.log(new Date().toISOString(), '<==> ', event.text);

        // If the event is a reply to main tweet (the one who contains the hashtag), we just skip
        if (!event.text.toLowerCase().includes(HASHTAG_TO_TRACK.toLowerCase())) {
          console.log('No Retweet!\n');
          // return;
        }

        /*const tweetId: string = event.retweeted_status ? event.retweeted_status.id_str : event.id_str;
        const tweetKey = `cpd_${tweetId}`;*/

        /**
         * In the normal behavior, when the bot account retweet a tweet containing the hashtag we are streaming,
         * the retweet is captured by the stream and we send the request to retweet this, we got an error from twitter
         * saying the tweet is already retweeted by the account.
         * To handle this, we save the tweet id in redis and if it exists, we don't send the request to the API anymore
         */
        /*Redis.get(tweetKey).then((value: string | null): void => {
          if (!value) {
            Redis.set(tweetKey, new Date().getTime().toString()).then((value: boolean): void => {
              // The tweet hasn't been retweeted yet so we can proceed
              TwitterService.retweet(tweetId);

              // TODO Notify registered account
            });
          }
        });*/
      },
    );

    TwitterService.stream.on('error', (error: any) => {
      logger.error(error);
      // throw error;
    });
  }

  /**
   * Get user account information through his screenName
   *
   * @param screenName
   */
  public static lookupUser(screenName: string): Promise<any> {
    const options: RequestParams = {
      screen_name: screenName,
    };

    return TwitterService.getClient().get('users/lookup', options);
  }
}

export { TwitterService };
