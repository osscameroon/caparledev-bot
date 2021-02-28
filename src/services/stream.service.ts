// Open a realtime stream of Tweets, filtered according to rules
// https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/quick-start
import request, { RequestPromiseOptions } from 'request-promise';
import needle from 'needle';
import * as querystring from 'querystring';

import { APP_BEARER_TOKEN, HASHTAG_TO_TRACK } from '../config/env';
import { CreateStreamRule, StreamResponse, StreamRule } from '../types/variables';
import { logger } from '../config/logger';
import { retweet } from './twitter.service';
import { onGenericError, transformStreamResponseToTweetInput } from '../utils/helpers';
import { Tweet } from '../models/tweet.model';

const baseStreamURL = 'https://api.twitter.com/2/tweets/search/stream';
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
    const streamTweet: StreamResponse = JSON.parse(data as string);

    logger.info(streamTweet);

    retweet(streamTweet.data.id);

    const tweetInput = transformStreamResponseToTweetInput(streamTweet);

    Tweet.create([tweetInput]).then().catch(onGenericError);
  } catch (e) {
    // Keep alive signal received. Do nothing.
  }
};

const streamConnect = () => {
  const streamURL = `${baseStreamURL}?${querystring.stringify(streamResponseFilter)}`;

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
    logger.warn('A connection error occurred. Reconnecting…');
    setTimeout(() => {
      timeout++;
      streamConnect();
    }, 2 ** timeout);
    streamConnect();
  });
};

export { initializeStream };
