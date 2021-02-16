import mongoose, { Schema } from 'mongoose';

import { IAccount } from '../types/models';

/**
 * Mongo Schema for Account
 *
 * Contains information about Twitter account (bot account for example)
 */
const accountSchema: Schema = new Schema({
	accountId: {
		type: String,
		unique: true,
		required: true,
	},
	accountName: {
		type: String,
		unique: true,
		required: true,
	},
	accessToken: {
		type: String,
		default: null,
	},
	accessTokenSecret: {
		type: String,
		default: null,
	},
	expirationDate: {
		type: Number,
		default: 0,
	},
	isBot: {
		type: Boolean,
		required: true,
		default: false,
	},
	tweetCount: { // Number of tweet containing the hashtag #caparledev done by this account
		type: Number,
		required: true,
		default: 0,
	},
},                                       {
	timestamps: true,
	collection: 'accounts',
});

export class AccountModel extends mongoose.model<IAccount>('Account', accountSchema) { }
