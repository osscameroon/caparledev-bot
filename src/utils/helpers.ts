import { TweetInput } from '../models/tweet.model';
import { StreamResponse } from '../types/variables';

export const streamResponseToTweetInput = (streamResponse: StreamResponse): TweetInput => {
  const {
    data: { author_id, created_at, id, text },
    includes: {
      users: [{ created_at: userCreateDate, location, name, username }],
    },
  } = streamResponse;

  return {
    id,
    createDate: new Date(created_at),
    text,
    user: {
      id: author_id,
      createDate: new Date(userCreateDate),
      location,
      name,
      username,
    },
  };
};
