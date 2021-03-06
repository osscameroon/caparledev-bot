import { processTweetFound, searchTweet } from '../services/twitter.service';
import { logger } from '../config/logger';
import { SearchResult, SearchErrorResponse } from '../types/variables';
import { findOrCreateSetting, Setting } from '../models/setting.model';
import { NEXT_SEARCH_TOKEN_SETTING_KEY } from './constants';
import { connectToDatabase } from '../config/dabatase';

const isErrorResponse = (result: SearchResult | SearchErrorResponse): result is SearchErrorResponse => {
  return (result as SearchErrorResponse).errors !== undefined;
};

const handleSearchTweetError = (error: any) => {
  const response: SearchErrorResponse = { errors: [{ parameters: [error] }], title: 'Tweet search failed!' };

  logger.error(response);

  return response;
};

export const searchTweetAndSave = async () => {
  const nextTokenSetting = await findOrCreateSetting(NEXT_SEARCH_TOKEN_SETTING_KEY, null);
  let nextToken = nextTokenSetting.value ?? undefined;
  let prevToken: string | undefined = undefined;

  do {
    prevToken = nextToken;
    const result: SearchResult | SearchErrorResponse = await searchTweet(nextToken).catch(handleSearchTweetError);

    logger.info(result);

    if (isErrorResponse(result)) {
      nextToken = undefined;
      logger.error(result);
    } else {
      nextToken = result.meta.next_token;
      await processTweetFound(result);
    }
  } while (nextToken);

  if (prevToken) {
    await Setting.updateOne({ key: NEXT_SEARCH_TOKEN_SETTING_KEY }, { value: prevToken });
  }

  logger.info('Tweet search completed !');
};

(async () => {
  await connectToDatabase();

  await searchTweetAndSave();

  process.exit(0);
})();
