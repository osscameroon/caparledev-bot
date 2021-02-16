import axios, { AxiosResponse, AxiosError } from 'axios';

import { CONSUMER_KEY, CONSUMER_SECRET } from '../config';
import { logger } from '../config/logger';

/**
 * A bearer token allows developers to have a more secure point of entry for using the Twitter APIs,
 * and are one of the core features of OAuth 2.0.
 * Authentication, which uses a Bearer Token, is also known as application-only authentication.
 * It's used to send requests to Activity Account API
 *
 * https://developer.twitter.com/en/docs/basics/authentication/oauth-2-0/bearer-tokens
 */
(async (): Promise<void> => {
	axios.post('https://api.twitter.com/oauth2/token', 'grant_type=client_credentials', {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		auth: {
			username: CONSUMER_KEY,
			password: CONSUMER_SECRET,
		},
	}).then((response: AxiosResponse): void => {
		logger.info(response.data);
	}).catch((error: AxiosError): void => {
		logger.error(error.response!.data);
	});
})();
