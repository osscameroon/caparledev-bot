import { Request, Response } from 'express';

import { BOT_ACCESS_TOKEN_KEY, BOT_ACCESS_TOKEN_SECRET, HASHTAG_TO_TRACK, TWITTER_CALLBACK_URL } from '../config/env';
import { logger } from '../config/logger';

import {
  getTemporaryOauthToken,
  getUserAccessToken,
  initializeStream,
  lookupUser,
  processAuthorization,
  resetTemporaryToken,
} from '../services/twitter.service';

const welcome = (_req: Request, res: Response) => {
  return res.json({ message: 'Welcome to Caparledev Bot' });
};

const generateAuthorizeURL = async (_req: Request, res: Response) => {
  const url: string = await processAuthorization(TWITTER_CALLBACK_URL);

  return res.json({ url });
};

const handleUserAuthenticationCallback = async (req: Request, res: Response) => {
  console.log('Auth callback called!');

  const { oauth_token, oauth_verifier }: any = req.query;

  if (!oauth_token || !oauth_verifier) {
    return res.status(422).json({ error: 'The oauth token or oauth verifier is missing!' });
  }

  const oauthTokenFromRedis = await getTemporaryOauthToken();

  if (oauth_token !== oauthTokenFromRedis) {
    return res.status(422).json({ error: "The oauth token doesn't match!" });
  }

  const response = await getUserAccessToken(oauth_token, oauth_verifier);

  const oauthToken = response.oauth_token;
  const oauthTokenSecret = response.oauth_token_secret;

  await resetTemporaryToken();

  return res.json({ oauthToken, oauthTokenSecret });
};

const findUserByScreenName = async (req: Request, res: Response) => {
  const { screenName } = req.params;

  const response = await lookupUser(screenName).catch((error) => {
    logger.error(error);

    return null;
  });

  return res.json(response);
};

const startHashtagStream = () => {
  if (BOT_ACCESS_TOKEN_KEY && BOT_ACCESS_TOKEN_SECRET) {
    initializeStream();

    logger.info(`You are now streaming hashtag ${HASHTAG_TO_TRACK}`);
  } else {
    logger.error('Bot access token not found. Unable to stream the data!');
  }
};

export { welcome, generateAuthorizeURL, handleUserAuthenticationCallback, findUserByScreenName, startHashtagStream };
