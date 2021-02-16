import { Document } from 'mongoose';

export interface IRegistration extends Document {
	tweetId: string;
	userId: string;
	userName: string;
	userScreenName: string;
	description: string;
	protected: boolean;
	verified: boolean;
	processed: boolean;
	approved: boolean;
	retweetCount: number;
}

export interface IAccount extends Document {
	accountId: string;
	accountName: string;
	accessToken: string;
	accessTokenSecret: string;
	expirationDate: number; // timestamp
}

export interface AccountActivitySubscription {
	environment: string;
	application_id: string;
	subscriptions: any[];
}
