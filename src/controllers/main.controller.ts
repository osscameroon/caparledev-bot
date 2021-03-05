import { Request, Response } from 'express';

import { ENABLE_STREAM, HASHTAG_TO_TRACK, TWITTER_CALLBACK_URL } from '../config/env';
import { logger } from '../config/logger';

import {
  getTemporaryOauthToken,
  getUserAccessToken,
  lookupUser,
  processAuthorization,
} from '../services/twitter.service';
import { initializeStream } from '../services/stream.service';
import { Setting } from '../models/setting.model';
import {
  INVALID_OAUTH_TOKEN,
  OAUTH_TOKEN_MISSING_ERROR,
  STREAMING_API_RUNNING,
  TEMPORARY_OAUTH_TOKEN_SETTING_KEY,
  WELCOME_MESSAGE,
} from '../utils/constants';

const welcome = (_req: Request, res: Response) => {
  return res.json({ message: WELCOME_MESSAGE });
};

const generateAuthorizeURL = async (_req: Request, res: Response) => {
  const url: string = await processAuthorization(TWITTER_CALLBACK_URL);

  return res.json({ url });
};

const handleUserAuthenticationCallback = async (req: Request, res: Response) => {
  const { oauth_token, oauth_verifier }: any = req.query;

  if (!oauth_token || !oauth_verifier) {
    return res.status(422).json({ error: OAUTH_TOKEN_MISSING_ERROR });
  }

  const oauthTokenFromDb = await getTemporaryOauthToken();

  if (oauth_token !== oauthTokenFromDb) {
    return res.status(422).json({ error: INVALID_OAUTH_TOKEN });
  }

  const response = await getUserAccessToken(oauth_token, oauth_verifier);

  const oauthToken = response.oauth_token;
  const oauthTokenSecret = response.oauth_token_secret;

  await Setting.updateOne({ key: TEMPORARY_OAUTH_TOKEN_SETTING_KEY }, { value: null });

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

const startHashtagStream = async () => {
  if (ENABLE_STREAM) {
    await initializeStream();

    logger.info(STREAMING_API_RUNNING(HASHTAG_TO_TRACK));
  }
};

export { welcome, generateAuthorizeURL, handleUserAuthenticationCallback, findUserByScreenName, startHashtagStream };
