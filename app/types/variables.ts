import { Response } from 'express';
import { Send } from 'express-serve-static-core';

export type Registration = {
  tweetId: string;
  userId: string;
  userName: string;
  userScreenName: string;
  protected: boolean;
};

export type Account = {
  accountId: string;
  accountName: string;
  accessToken: string;
  accessTokenSecret: string;
  expirationDate: number; // timestamp
};

export type UserAccessTokenResponse = {
  oauth_token: string;
  oauth_token_secret: string;
  user_id: string;
  screen_name: string;
};

export type RequestTokenResponse = {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: string;
};

export type TweetObject = {
  created_at: string;
  id: number;
  id_str: string;
  text: string;
  source: string;
  truncated: boolean;
  in_reply_to_status_id?: any;
  in_reply_to_status_id_str?: any;
  in_reply_to_user_id: number;
  in_reply_to_user_id_str: string;
  in_reply_to_screen_name: string;
  user: User;
};

type User = {
  id: number;
  id_str: string;
  name: string;
  screen_name: string;
  location?: any;
  url?: any;
  description: string;
  translator_type: string;
  protected: boolean;
  verified: boolean;
  followers_count: number;
  friends_count: number;
  listed_count: number;
  favourites_count: number;
  statuses_count: number;
  created_at: string;
  utc_offset?: any;
  time_zone?: any;
  geo_enabled: boolean;
  lang?: any;
  contributors_enabled: boolean;
  is_translator: boolean;
  profile_background_color: string;
  profile_background_image_url: string;
  profile_background_image_url_https: string;
  profile_background_tile: boolean;
  profile_link_color: string;
  profile_sidebar_border_color: string;
  profile_sidebar_fill_color: string;
  profile_text_color: string;
  profile_use_background_image: boolean;
  profile_image_url: string;
  profile_image_url_https: string;
  default_profile: boolean;
  default_profile_image: boolean;
  following?: any;
  follow_request_sent?: any;
  notifications?: any;
};

export type TwitterErrorItem = {
  code: number;
  message: string;
};

export type TwitterError = {
  errors: TwitterErrorItem[];
};

export type CustomResponse = {
  sendResponse: Send<any, any>;
} & Response;
