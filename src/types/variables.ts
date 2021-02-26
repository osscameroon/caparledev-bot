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

export type TwitterErrorItem = {
  code: number;
  message: string;
};

export type TwitterError = {
  errors: TwitterErrorItem[];
};

export type EnhancedLogger = {
  info: (output: unknown) => void;
  error: (output: unknown) => void;
};
