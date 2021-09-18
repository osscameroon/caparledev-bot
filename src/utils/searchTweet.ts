import { SearchResult, SearchErrorResponse } from '../types';
import { logger } from '../config/logger';
import { processTweetFound, searchTweet } from '../services/twitter.service';

const isErrorResponse = (result: SearchResult | SearchErrorResponse): result is SearchErrorResponse => {
  return (result as SearchErrorResponse).errors !== undefined;
};

const handleSearchTweetError = (error: any) => {
  const response: SearchErrorResponse = { errors: [{ parameters: [error] }], title: 'Tweet search failed!' };

  logger.error(response);

  return response;
};

export const searchTweetAndSave = async () => {
  let nextToken: string | undefined = undefined;

  do {
    const result: SearchResult | SearchErrorResponse = await searchTweet(nextToken).catch(handleSearchTweetError);

    logger.info(result);

    if (isErrorResponse(result)) {
      nextToken = undefined;
      logger.error(result);
    } else {
      nextToken = result.meta?.next_token;
      await processTweetFound(result);
    }
  } while (nextToken);

  logger.info('Tweet search completed !');
};
