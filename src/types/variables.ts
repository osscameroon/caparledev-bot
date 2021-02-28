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
  warn: (output: unknown) => void;
};

export type StreamRule = {
  id: string;
  value: string;
  tag: string;
};

export type CreateStreamRule = {
  data: StreamRule[];
  meta: {
    sent: Date;
  };
};

type MatchingRule = Omit<StreamRule, 'value'>;

type User = {
  location: string;
  created_at: string;
  name: string;
  id: string;
  username: string;
};

export type StreamResponse = {
  data: {
    id: string;
    created_at: string;
    text: string;
    author_id: string;
  };
  includes: {
    users: User[];
  };
  matching_rules: MatchingRule[];
};
