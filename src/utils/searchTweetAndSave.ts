import { processTweetFound, searchTweet } from '../services/twitter.service';
import { logger } from '../config/logger';
import { SearchResult } from '../types/variables';
import { findOrCreateSetting, Setting } from '../models/setting.model';
import { NEXT_SEARCH_TOKEN_SETTING_KEY } from './constants';
import { connectToDatabase } from '../config/dabatase';

export const searchTweetAndSave = async () => {
  const nextTokenSetting = await findOrCreateSetting(NEXT_SEARCH_TOKEN_SETTING_KEY, null);
  let nextToken = nextTokenSetting.value ?? undefined;
  let prevToken: string | undefined = undefined;

  do {
    prevToken = nextToken;
    const result: SearchResult | undefined = await searchTweet(nextToken).catch((error) => {
      logger.error('Tweet search failed!');
      logger.error(error);

      return undefined;
    });

    if (!result) {
      nextToken = undefined;
    } else {
      nextToken = result.meta.next_token;
      await processTweetFound(result);
    }
  } while (nextToken);

  await Setting.updateOne({ key: NEXT_SEARCH_TOKEN_SETTING_KEY }, { value: prevToken });

  logger.info('Tweet search completed !');
};

(async () => {
  await connectToDatabase();

  await searchTweetAndSave();

  process.exit(0);
})();
