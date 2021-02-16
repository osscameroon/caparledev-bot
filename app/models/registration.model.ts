import mongoose, { Schema } from 'mongoose';

import { IRegistration } from '../types/models';

/**
 * Mongo Schema for Account Registration to received notification when
 * a new tweet with the hashtag is discovered
 */
const registrationSchema: Schema = new Schema({
	tweetId: {
		type: String,
		unique: true,
		required: true,
	},
	userId: {
		type: String,
		unique: true,
		required: true,
	},
	userName: {
		type: String,
		required: true,
	},
	userScreenName: {
		type: String,
		required: true,
		unique: true,
	},
	protected: {
		type: Boolean,
		required: true,
		default: false,
	},
},                                            {
	timestamps: true,
	collection: 'registrations',
});

export class RegistrationModel extends mongoose.model<IRegistration>('Registration', registrationSchema) { }
