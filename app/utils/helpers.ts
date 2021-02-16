import crypto from 'crypto';
import { Activity, Registration, TweetObject, TwitterActivityEvent } from '../types';

type GetChallengeResponseFunc = (crcToken: string, consumerSecret: string) => string;

/**
 * Creates a HMAC SHA-256 hash created from the app TOKEN and
 * your app Consumer Secret.
 *
 * @param  crcToken  the token provided by the incoming GET request
 * @param  consumerSecret  the consumer secret of the twitter application
 *
 * @return string
 */
export const getChallengeResponse: GetChallengeResponseFunc = (crcToken: string, consumerSecret: string): string => {
	const encoded: string = crypto.createHmac('sha256', consumerSecret).update(crcToken).digest('base64');

	return `sha256=${encoded}`;
};

export const isCreateEvent: Function = (activity: Activity): boolean => {
	return Object.keys(activity).indexOf(TwitterActivityEvent.tweetCreateEvents) >= 0;
};

export const extractRegistrationData: Function = (tweet: TweetObject): Registration => {
	return {
		tweetId: tweet.id_str,
		userId: tweet.user.id_str,
		userName: tweet.user.name,
		userScreenName:  tweet.user.screen_name,
		protected:  tweet.user.protected,
	};
};
