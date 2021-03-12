import { TweetField, UserField } from '../types';
import { logger } from '../config/logger';
import { TweetInput } from '../models/tweet.model';
import { UserInput } from '../models/user.model';

export const transformTweetFieldToTweetInput = (tweetField: TweetField): TweetInput => {
  const { author_id, created_at, id, text } = tweetField;

  return {
    id,
    createDate: new Date(created_at),
    retweeted: false,
    text,
    author: author_id,
  };
};

export const transformUserFieldToUserInput = (userField: UserField): UserInput => {
  const { created_at: userCreateDate, id: user_id, location, name, username } = userField;

  return {
    id: user_id,
    createDate: new Date(userCreateDate),
    location: location ?? null,
    name,
    username,
  };
};

export const onGenericError = (error: unknown) => logger.error(error);
