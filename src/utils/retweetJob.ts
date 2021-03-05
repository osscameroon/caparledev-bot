import cron from 'node-cron';

import { CRON_RETWEET_INTERVAL } from '../config/env';
import { logger } from '../config/logger';
import { Setting } from '../models/setting.model';
import { RATE_LIMIT_TIME_SETTING_KEY } from './constants';

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

const startRetweetJob = () => {
  let isRunning = false;

  cron.schedule(
    CRON_RETWEET_INTERVAL,
    async () => {
      if (isRunning) {
        return;
      }
      isRunning = true;

      const canRetweet = await canPerformRetweet();

      logger.info(`Can Retweet => ${canRetweet}`);
      if (!canRetweet) {
        return;
      }

      // TODO Search tweet not retweeted in DB and retweet them
    },
    {
      scheduled: true,
      timezone: 'Europe/Paris',
    },
  );
};

export { startRetweetJob };
