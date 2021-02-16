import request from 'request-promise';

import { ACTIVITY_ACCOUNT_BASE_URL, BEARER_ACCESS_TOKEN, ENVIRONMENT_NAME } from '../config';

/**
 * This class implement useful methods to communicate with Twitter Account Activity API
 */
class AccountActivityService {
	private static oauthCredentials: any;

	/**
	 * Setup Oauth Credentials
	 *
	 * @param consumerKey
	 * @param consumerSecret
	 * @param accessTokenKey
	 * @param accessTokenSecret
	 */
	public static init(
		consumerKey: string, consumerSecret: string, accessTokenKey: string, accessTokenSecret: string,
	): void {
		AccountActivityService.oauthCredentials = {
			consumer_key: consumerKey,
			consumer_secret: consumerSecret,
			token: accessTokenKey,
			token_secret: accessTokenSecret,
		};
	}

	/**
	 * Get Account Activity endpoint by adding the environment to the route
	 * Use this link to know more about Account Activity API
	 * https://developer.twitter.com/en/docs/tutorials/getting-started-with-the-account-activity-api
	 *
	 * @param route
	 */
	private static endpoint(route: string): string {
		return `/${ENVIRONMENT_NAME}/${route}.json`;
	}

	/**
	 * Register a webhook URL
	 *
	 * @param url
	 */
	public static async registerWebhook(url: string): Promise<any> {
		const requestOptions: any = {
			url: `${ACTIVITY_ACCOUNT_BASE_URL}${AccountActivityService.endpoint('webhooks')}`,
			oauth: AccountActivityService.oauthCredentials,
			headers: {
				'Content-type': 'application/x-www-form-urlencoded',
			},
			form: { url },
			json: true,
		};

		return request.post(requestOptions);
	}

	/**
	 * Get all webhooks registered
	 */
	public static async getWebhooks(): Promise<any> {
		const requestOptions: any = {
			url: `${ACTIVITY_ACCOUNT_BASE_URL}${AccountActivityService.endpoint('webhooks')}`,
			auth: {
				bearer: BEARER_ACCESS_TOKEN,
			},
			resolveWithFullResponse: true,
			json: true,
		};

		return request.get(requestOptions);
	}

	/**
	 * Delete a webhook
	 *
	 * @param webhookId
	 */
	public static async deleteWebhook(webhookId: string): Promise<any> {
		const requestOptions: any = {
			url: ACTIVITY_ACCOUNT_BASE_URL + AccountActivityService.endpoint(`webhooks/${webhookId}`),
			oauth: AccountActivityService.oauthCredentials,
			resolveWithFullResponse: true,
			json: true,
		};

		return request.delete(requestOptions);
	}

	/**
	 * Trigger webhook URL challenge
	 *
	 * @param webhookId
	 */
	public static async triggerWebhookChallenge(webhookId: string): Promise<any> {
		const requestOptions: any = {
			url: ACTIVITY_ACCOUNT_BASE_URL + AccountActivityService.endpoint(`webhooks/${webhookId}`),
			auth: {
				bearer: BEARER_ACCESS_TOKEN,
			},
			resolveWithFullResponse: true,
			json: true,
		};

		return request.put(requestOptions);
	}

	/**
	 * Create a subscription
	 *
	 * @param userAccessToken
	 * @param userAccessTokenSecret
	 */
	public static async createSubscription(userAccessToken: string, userAccessTokenSecret: string): Promise<any> {
		const requestOptions: any = {
			url: `${ACTIVITY_ACCOUNT_BASE_URL}${AccountActivityService.endpoint('subscriptions')}`,
			oauth: {
				...AccountActivityService.oauthCredentials,
				token: userAccessToken,
				token_secret: userAccessTokenSecret,
			},
			resolveWithFullResponse: true,
			json: true,
		};

		return request.post(requestOptions);
	}

	/**
	 * Delete a subscription
	 *
	 * @param userAccessToken
	 * @param userAccessTokenSecret
	 */
	public static async deleteSubscription(userAccessToken: string, userAccessTokenSecret: string): Promise<any> {
		const requestOptions: any = {
			url: ACTIVITY_ACCOUNT_BASE_URL + AccountActivityService.endpoint('subscriptions'),
			oauth: {
				...AccountActivityService.oauthCredentials,
				token: userAccessToken,
				token_secret: userAccessTokenSecret,
			},
			resolveWithFullResponse: true,
			json: true,
		};

		return request.delete(requestOptions);
	}

	/**
	 * Get all subscriptions
	 */
	public static async getSubscriptions(): Promise<any> {
		const requestOptions: any = {
			url: ACTIVITY_ACCOUNT_BASE_URL + AccountActivityService.endpoint('subscriptions/list'),
			auth: {
				bearer: BEARER_ACCESS_TOKEN,
			},
			json: true,
		};

		return request.get(requestOptions);
	}
}

export { AccountActivityService };
