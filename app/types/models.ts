import { Document } from 'mongoose';

export type IRegistration = {
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
} & Document;

export type IAccount = {
  accountId: string;
  accountName: string;
  accessToken: string;
  accessTokenSecret: string;
  expirationDate: number; // timestamp
} & Document;

export type AccountActivitySubscription = {
  environment: string;
  application_id: string;
  subscriptions: any[];
};
