import cron from 'node-cron';

import { CRON_RETWEET_INTERVAL } from '../config/env';

const startRetweetJob = () => {
  let isRunning = false;

  cron.schedule(
    CRON_RETWEET_INTERVAL,
    () => {
      if (isRunning) {
        return;
      }
      isRunning = true;
      // TODO Logic here
    },
    {
      scheduled: true,
      timezone: 'Europe/Paris',
    },
  );
};

export { startRetweetJob };
