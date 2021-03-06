import cron from 'node-cron';

import { CRON_RETWEET_INTERVAL } from '../config/env';
import { logger } from '../config/logger';
import { Setting } from '../models/setting.model';
import { ALREADY_RETWEETED_CODE, RATE_LIMIT_TIME_SETTING_KEY, RETWEET_JOB_TRIGGERED_MESSAGE } from './constants';
import { Tweet, TweetDocument } from '../models/tweet.model';
import { handleRetweetRateLimit, retweet } from '../services/twitter.service';
import { onGenericError } from './helpers';

const canPerformRetweet = async () => {
  const rateLimitExpireSetting = await Setting.findOne({ key: RATE_LIMIT_TIME_SETTING_KEY });

  if (!rateLimitExpireSetting || !rateLimitExpireSetting?.value) {
    return true;
  }

  const rateLimitExpireTimestamp = parseInt(rateLimitExpireSetting.value, 10);
  const isExpired = new Date().getTime() > rateLimitExpireTimestamp;

  if (isExpired) {
    await Setting.updateOne({ key: RATE_LIMIT_TIME_SETTING_KEY }, { value: null });

    return true;
  }

  return false;
};

const handleAlreadyRetweetedError = async (errors: any[], tweet: TweetDocument) => {
  // [{"code": 327, "message": "You have already retweeted this Tweet."}]
  const [error] = errors;

  if (error?.code === ALREADY_RETWEETED_CODE) {
    logger.error(`Tweet Id: ${tweet.id}`);

    Tweet.update({ id: tweet.id }, { retweeted: true }).then().catch(onGenericError);
  }
};

const findTweetAndRetweet = async () => {
  const tweets = await Tweet.find({ retweeted: false }).limit(20).sort({ createDate: -1 }).exec();

  tweets.map((tweet) => {
    retweet(tweet.id)
      .then(() => {
        Tweet.updateOne({ id: tweet.id }, { retweeted: true }).then().catch(onGenericError);
      })
      .catch((error) => {
        handleAlreadyRetweetedError(error, tweet);
        handleRetweetRateLimit(error);
      });
  });
};

const startRetweetJob = () => {
  let isRunning = false;

  cron.schedule(
    CRON_RETWEET_INTERVAL,
    async () => {
      if (isRunning) {
        return;
      }
      isRunning = true;

      logger.info(RETWEET_JOB_TRIGGERED_MESSAGE);

      const canRetweet = await canPerformRetweet();

      if (!canRetweet) {
        return;
      }

      // Search tweets not retweeted in DB and retweet them
      await findTweetAndRetweet();
      isRunning = false;
    },
    {
      scheduled: true,
      timezone: 'Europe/Paris',
    },
  );
};

export { startRetweetJob };
