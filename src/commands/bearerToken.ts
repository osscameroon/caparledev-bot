import axios from 'axios';

import { APP_CONSUMER_KEY, APP_CONSUMER_SECRET } from '../config/env';
import { logger } from '../config/logger';
import { BEARER_TOKEN_RESPONSE } from '../utils/constants';

/**
 * It will be used to create rules for Stream API
 * More info here: https://developer.twitter.com/en/docs/basics/authentication/oauth-2-0/bearer-tokens
 */
(async () => {
  axios
    .post('https://api.twitter.com/oauth2/token', 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: APP_CONSUMER_KEY,
        password: APP_CONSUMER_SECRET,
      },
    })
    .then((response) => {
      console.info(BEARER_TOKEN_RESPONSE(response.data.access_token));
    })
    .catch((error) => {
      logger.error(error.response?.data);
    });
})();
