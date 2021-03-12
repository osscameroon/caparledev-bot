// Open a realtime stream of Tweets, filtered according to rules
// https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/quick-start
import request, { RequestPromiseOptions } from 'request-promise';
import needle from 'needle';
import { stringify } from 'querystring';

import { APP_BEARER_TOKEN, HASHTAG_TO_TRACK } from '../config/env';
import { CreateStreamRule, StreamResult, StreamRule } from '../types';
import { logger } from '../config/logger';
import { handleRetweetRateLimit, retweet } from './twitter.service';
import { onGenericError, transformTweetFieldToTweetInput, transformUserFieldToUserInput } from '../utils/helpers';
import { Tweet } from '../models/tweet.model';
import { API_TWITTER_BASE_URL, STREAM_TIMEOUT_MESSAGE } from '../utils/constants';
import { upsertUser } from '../models/user.model';

const baseStreamURL = `${API_TWITTER_BASE_URL}/2/tweets/search/stream`;
const streamRulesURL = `${baseStreamURL}/rules`;

const streamResponseFilter: Record<string, string> = {
  'tweet.fields': 'created_at',
  expansions: 'author_id',
  'user.fields': 'created_at,location',
};

const rules: Partial<StreamRule>[] = [
  {
    value: `${HASHTAG_TO_TRACK} -is:retweet`,
    tag: 'Caparledev Hashtag',
  },
];

const getAllRules = async () => {
  const options: RequestPromiseOptions = {
    headers: {
      authorization: `Bearer ${APP_BEARER_TOKEN}`,
    },
    json: true,
    resolveWithFullResponse: true,
  };

  const response = await request.get(streamRulesURL, options);

  if (response.statusCode !== 200) {
    throw new Error(response.body);
  }

  return response.body as CreateStreamRule;
};

const deleteAllRules = async (rules: CreateStreamRule) => {
  if (!Array.isArray(rules.data)) {
    return null;
  }

  const ruleIds = rules.data.map((rule) => rule.id);

  const options: RequestPromiseOptions = {
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${APP_BEARER_TOKEN}`,
    },
    body: { delete: { ids: ruleIds } },
    json: true,
    resolveWithFullResponse: true,
  };

  const response = await request.post(streamRulesURL, options);

  if (response.statusCode !== 200) {
    throw new Error(response.body);
  }

  return response.body;
};

const setRules = async () => {
  const options: RequestPromiseOptions = {
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${APP_BEARER_TOKEN}`,
    },
    body: { add: rules },
    json: true,
    resolveWithFullResponse: true,
  };

  const response = await request.post(streamRulesURL, options);

  if (response.statusCode !== 201) {
    throw new Error(JSON.stringify(response.body, null, 2));
  }

  return response.body;
};

const onStreamDataReceived = (data: any) => {
  try {
    const streamTweet: StreamResult = JSON.parse(data as string);

    logger.info(streamTweet);

    const tweetInput = transformTweetFieldToTweetInput(streamTweet.data);
    const userInput = transformUserFieldToUserInput(streamTweet.includes.users[0]);

    upsertUser(userInput).then().catch(onGenericError);

    retweet(streamTweet.data.id)
      .then(() => {
        tweetInput.retweeted = true;
        Tweet.create([tweetInput]).then().catch(onGenericError);
      })
      .catch((error) => {
        Tweet.create([tweetInput]).then().catch(onGenericError);

        handleRetweetRateLimit(error);
      });
  } catch (e) {
    // Keep alive signal received. Do nothing.
  }
};

const streamConnect = () => {
  const streamURL = `${baseStreamURL}?${stringify(streamResponseFilter)}`;

  const options = {
    headers: {
      'User-Agent': 'v2FilterStreamJS',
      authorization: `Bearer ${APP_BEARER_TOKEN}`,
    },
    timeout: 20000,
  };

  const stream = needle.get(streamURL, options);

  stream.on('data', onStreamDataReceived).on('error', (error: any) => {
    logger.error(error);
    if (error.code === 'ETIMEDOUT') {
      stream.emit('timeout');
    }
  });

  return stream;
};

const initializeStream = async () => {
  let currentRules;

  try {
    currentRules = await getAllRules();

    await deleteAllRules(currentRules);

    await setRules();
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }

  // Listen to the stream.This reconnection logic will attempt to reconnect when a disconnection is detected.
  // To avoid rate limits, this logic implements exponential backoff, so the wait time
  // will increase if the client cannot reconnect to the stream.

  const filteredStream = streamConnect();
  let timeout = 0;

  filteredStream.on('timeout', () => {
    // Reconnect on error
    logger.warn(STREAM_TIMEOUT_MESSAGE);
    setTimeout(() => {
      timeout++;
      streamConnect();
    }, 2 ** timeout);
    streamConnect();
  });
};

export { initializeStream };
