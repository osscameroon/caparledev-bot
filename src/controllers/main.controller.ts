import { Request, Response } from 'express';

import { HASHTAG_TO_TRACK, TWITTER_CALLBACK_URL } from '../config/env';
import { logger } from '../config/logger';

import { UserAccessTokenResponse } from '../types/variables';
import { Account, AccountInput, AccountDocument } from '../models/account.model';
import { TwitterService } from '../services/twitter.service';

const welcome = (_req: Request, res: Response) => {
  return res.json({ message: 'Welcome to Caparledev Bot' });
};

const generateAuthorizeURL = async (_req: Request, res: Response) => {
  const url: string = await TwitterService.processAuthorization(TWITTER_CALLBACK_URL);

  res.json({ url });
};

const handleUserAuthenticationCallback = async (req: Request, res: Response) => {
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
    const account: AccountDocument | null = await Account.findOne({ accountId: response.user_id });

    if (account) {
      await Account.findByIdAndUpdate(
        { _id: account._id },
        {
          accountName: response.screen_name,
          accessToken: oauthToken,
          accessTokenSecret: oauthTokenSecret,
        },
      );

      console.log('Account updated !');
    } else {
      const input: AccountInput = {
        accountId: response.user_id,
        accountName: response.screen_name,
        accessToken: oauthToken,
        accessTokenSecret: oauthTokenSecret,
        expirationDate: 1000,
      };

      await Account.create([input]);

      console.log('Account created !');

      TwitterService.setAccountClient(oauthToken, oauthTokenSecret);
    }

    res.json({ message: 'success' });
  } else {
    res.status(400).json({ message: 'Failed to retrieve access token' });
  }
};

const findUserByScreenName = async (req: Request, res: Response) => {
  const { screenName } = req.params;

  const response = await TwitterService.lookupUser(screenName).catch((error) => {
    logger.error(error);

    return null;
  });

  return res.json(response);
};

const startHashtagStream = () => {
  TwitterService.initializeStream();

  logger.info(`You are now streaming hashtag ${HASHTAG_TO_TRACK}`);
};

export { welcome, generateAuthorizeURL, handleUserAuthenticationCallback, findUserByScreenName, startHashtagStream };
