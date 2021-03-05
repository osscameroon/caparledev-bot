import { processTweetFound, searchTweet } from '../services/twitter.service';
import { logger } from '../config/logger';
import { SearchResult } from '../types/variables';

export const populateDb = async () => {
  let nextToken: string | undefined = undefined;

  do {
    const result: SearchResult | undefined = await searchTweet(nextToken).catch((error) => {
      logger.error('Tweet search failed!');
      logger.error(error);

      return undefined;
    });

    if (!result) {
      nextToken = undefined;
    } else {
      logger.info(JSON.stringify(result));

      nextToken = result.meta.next_token;
      await processTweetFound(result);
    }
  } while (nextToken);

  // TODO save next_token
  logger.info('Tweet search completed !');
};

(async () => {
  await populateDb();
})();
