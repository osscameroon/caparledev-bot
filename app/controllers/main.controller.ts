import { Request, Response } from 'express';

import { HASHTAG_TO_TRACK, TWITTER_CALLBACK_URL } from '../config';
import { logger } from '../config/logger';

import { UserAccessTokenResponse } from '../types/variables';
import { IAccount } from '../types/models';

import { AccountModel } from '../models/account.model';

import { TwitterService } from '../services/twitter.service';

import { TWEET_PREFIX_KEY } from '../utils/constants';
import { Redis } from '../utils/redis';

class MainController {
  /**
   * Welcome message. Can be used for healthcheck
   */
  public static welcome(_req: Request, res: Response): void {
    res.json({ message: 'Welcome to Caparledev Bot' });
  }

  /**
   * User authentication callback
   */
  public static async authCallback(req: Request, res: Response): Promise<void> {
    console.log('Auth callback called!');

    const { oauth_token, oauth_verifier }: any = req.query;

    if (!oauth_token || !oauth_verifier) {
      res.status(422).json({ error: 'The oauth token or oauth verifier is missing!' });
    }

    if (oauth_token !== TwitterService.getTempOauthToken()) {
      res.status(422).json({ error: "The oauth token doesn't match!" });
    }

    const response: UserAccessTokenResponse = await TwitterService.getUserAccessToken(oauth_token, oauth_verifier);

    const oauthToken: string = response.oauth_token;
    const oauthTokenSecret: string = response.oauth_token_secret;

    if (oauthToken && oauthTokenSecret) {
      const account: IAccount | null = await AccountModel.findOne({ accountId: response.user_id });

      if (account) {
        await AccountModel.findByIdAndUpdate(
          { _id: account._id },
          {
            accountName: response.screen_name,
            accessToken: oauthToken,
            accessTokenSecret: oauthTokenSecret,
          },
        );

        console.log('Account updated !');
      } else {
        await AccountModel.create([
          {
            accountId: response.user_id,
            accountName: response.screen_name,
            accessToken: oauthToken,
            accessTokenSecret: oauthTokenSecret,
            isBot: true,
          },
        ]);

        console.log('Account created !');

        TwitterService.setAccountClient(oauthToken, oauthTokenSecret);
      }

      res.json({ message: 'success' });
    } else {
      res.status(400).json({ message: 'Failed to retrieve access token' });
    }
  }

  /**
   * Get the authorize URL
   */
  public static async getAuthorizeURL(_req: Request, res: Response): Promise<any> {
    const url: string = await TwitterService.processAuthorization(TWITTER_CALLBACK_URL);

    res.json({ url });
  }

  /**
   * Get Twitter user's information
   */
  public static async lookupUsers(req: Request, res: Response): Promise<void> {
    const screenNames: string = req.body.screen_names;

    TwitterService.lookupUsers(screenNames)
      .then((result: any): void => {
        res.json(result);
      })
      .catch((error: any): void => {
        logger.error(error);
        res.status(400).json(error);
      });
  }

  /**
   * Connect to Twitter Stream API and start the stream
   */
  public static async stream(): Promise<void> {
    TwitterService.initializeStream();

    logger.info(`You are now streaming hashtag ${HASHTAG_TO_TRACK}`);
  }

  /**
   * This methods fetch all tweets who failed to be retweeted due to Rate Limit error and retweet them
   * The action is performed every 30 minutes
   */
  public static async retweetMonitor(): Promise<void> {
    let working = false;

    setInterval(async (): Promise<void> => {
      if (!working) {
        working = true;
        const keys: string[] = await Redis.keys(TWEET_PREFIX_KEY);

        for (let i = 0; i < keys.length; i += 1) {
          const tweetId: string | null = await Redis.get(keys[0]);

          if (tweetId) {
            TwitterService.retweet(tweetId).then(() => {
              Redis.set(keys[0], '', 1000);
            });
          }
        }

        working = false;
      }
    }, 30 * 1000);
  }
}

export { MainController };
