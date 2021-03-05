import { TweetInput } from '../models/tweet.model';
import { StreamResponse } from '../types/variables';
import { logger } from '../config/logger';
import { UserInput } from '../models/user.model';

export const transformStreamResponseToTweetInput = (streamResponse: StreamResponse): [TweetInput, UserInput] => {
  const {
    data: { author_id, created_at, id, text },
    includes: {
      users: [{ created_at: userCreateDate, id: user_id, location, name, username }],
    },
  } = streamResponse;

  const userInput: UserInput = {
    id: user_id,
    createDate: new Date(userCreateDate),
    location,
    name,
    username,
  };

  const tweetInput: TweetInput = {
    id,
    createDate: new Date(created_at),
    retweeted: false,
    text,
    author: author_id,
  };

  return [tweetInput, userInput];
};

export const onGenericError = (error: unknown) => logger.error(error);
