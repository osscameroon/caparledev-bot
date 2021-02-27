import mongoose, { Document, Model, Schema } from 'mongoose';

type AccountDocument = Document & {
  accountId: string;
  accountName: string;
  accessToken: string;
  accessTokenSecret: string;
  expirationDate: number;
};

type AccountInput = {
  accountId: AccountDocument['accountId'];
  accountName: AccountDocument['accountName'];
  accessToken: AccountDocument['accessToken'];
  accessTokenSecret: AccountDocument['accessTokenSecret'];
  expirationDate: AccountDocument['expirationDate'];
};

/**
 * Mongo Schema for Account
 */
const accountSchema: Schema = new Schema(
  {
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
    tweetCount: {
      // Number of tweet containing the hashtag #caparledev done by this account
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'accounts',
  },
);

const Account: Model<AccountDocument> = mongoose.model('Account', accountSchema);

export { AccountDocument, Account, AccountInput };
