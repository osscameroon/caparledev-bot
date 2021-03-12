import cron from 'cron';

import { CRON_SEARCH_INTERVAL } from '../config/env';
import { searchTweetAndSave } from '../utils/searchTweet';

let isRunning = false;

const searchTweetJob = new cron.CronJob(
  CRON_SEARCH_INTERVAL,
  async () => {
    if (isRunning) {
      return;
    }
    isRunning = true;

    // Search tweets not retweeted then save in DB
    await searchTweetAndSave();
    isRunning = false;
  },
  null,
  true,
  'Europe/Paris',
);

const startSearchTweetJob = () => {
  searchTweetJob.start();
};

export { startSearchTweetJob };
