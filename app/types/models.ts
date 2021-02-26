import { Document } from 'mongoose';

export type IAccount = {
  accountId: string;
  accountName: string;
  accessToken: string;
  accessTokenSecret: string;
  expirationDate: number; // timestamp
} & Document;
