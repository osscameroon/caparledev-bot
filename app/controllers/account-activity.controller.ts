import { Request, Response, NextFunction } from 'express';

import { AccountActivitySubscription } from '../types/models';
import { CONSUMER_SECRET } from '../config';

import { getChallengeResponse } from '../utils/helpers';
import { AccountActivityService } from '../services/account-activity.service';

class AccountActivityController {
	/**
	 * challenge()
	 *
	 * Generate the CRC Token
	 *
	 * @param {Request} req: Request object
	 * @param {Response} res: Response object
	 * @param {NextFunction} next: NextFunction object
	 *
	 * @return Object
	 */
	public static async challenge(req: Request, res: Response, next: NextFunction): Promise<void> {
		const crcToken: string = req.query.crc_token as string;

		if (!crcToken) {
			res.status(422).json({ error: 'The CRC token is missing!' });
		}

		const response: string = getChallengeResponse(crcToken, CONSUMER_SECRET);

		res.json({ response_token: response });
	}

	/**
	 * registerWebhook()
	 *
	 * Register a webhook
	 *
	 * @param {Request} req: Request object
	 * @param {Response} res: Response object
	 * @param {NextFunction} next: NextFunction object
	 *
	 * @return Object
	 */
	public static async registerWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
		const url: string = req.body.url;

		if (!url) {
			res.status(422).json({ error: 'The CRC token is missing!' });
		}

		const response: any = await AccountActivityService.registerWebhook(url);

		res.json(response);
	}

	/**
	 * getWebhooks()
	 *
	 * Get the list of all the registered webhooks
	 *
	 * @param {Request} req: Request object
	 * @param {Response} res: Response object
	 * @param {NextFunction} next: NextFunction object
	 *
	 * @return Object
	 */
	public static async getWebhooks(req: Request, res: Response, next: NextFunction): Promise<void> {
		const response: any = await AccountActivityService.getWebhooks();

		res.json(response.body);
	}

	/**
	 * deleteWebhook()
	 *
	 * Delete a webhook
	 *
	 * @param {Request} req: Request object
	 * @param {Response} res: Response object
	 * @param {NextFunction} next: NextFunction object
	 *
	 * @return Object
	 */
	public static async deleteWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id: string = req.params.id;

		if (!id) {
			res.status(422).json({ error: 'The Webhook id is missing!' });
		}

		await AccountActivityService.deleteWebhook(id);

		res.json({ message: 'success' });
	}

	/**
	 * triggerWebhookChallenge()
	 *
	 * Trigger a webhook challenge
	 *
	 * @param {Request} req: Request object
	 * @param {Response} res: Response object
	 * @param {NextFunction} next: NextFunction object
	 *
	 * @return Object
	 */
	public static async triggerWebhookChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id: string = req.params.id;

		if (!id) {
			res.status(422).json({ error: 'The Webhook id is missing!' });
		}

		await AccountActivityService.triggerWebhookChallenge(id);

		res.json({ message: 'success' });
	}

	/**
	 * createSubscription()
	 *
	 * Create a subscription to an user's activity
	 *
	 * @param {Request} req: Request object
	 * @param {Response} res: Response object
	 * @param {NextFunction} next: NextFunction object
	 *
	 * @return Object
	 */
	public static async createSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { access_token, access_token_secret }: any = req.body;

		if (!access_token || !access_token_secret) {
			res.status(422).json({ error: 'The Access token or Access token secret is missing!' });
		}

		await AccountActivityService.createSubscription(access_token, access_token_secret);

		res.json({ message: 'success' });
	}

	/**
	 * deleteSubscription()
	 *
	 * Delete a subscription to an user's activity
	 *
	 * @param {Request} req: Request object
	 * @param {Response} res: Response object
	 * @param {NextFunction} next: NextFunction object
	 *
	 * @return Object
	 */
	public static async deleteSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { access_token, access_token_secret }: any = req.body;

		if (!access_token || !access_token_secret) {
			res.status(422).json({ error: 'The Access token or Access token secret is missing!' });
		}

		await AccountActivityService.deleteSubscription(access_token, access_token_secret);

		res.json({ message: 'success' });
	}

	/**
	 * getSubscriptions()
	 *
	 * Get the list of all subscriptions
	 *
	 * @param {Request} req: Request object
	 * @param {Response} res: Response object
	 * @param {NextFunction} next: NextFunction object
	 *
	 * @return Object
	 */
	public static async getSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
		const response: AccountActivitySubscription = await AccountActivityService.getSubscriptions();

		res.json(response);
	}
}

export { AccountActivityController };
