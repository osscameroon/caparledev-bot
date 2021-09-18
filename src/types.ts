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

export type UserField = {
  location?: string;
  created_at: string;
  name: string;
  id: string;
  username: string;
};

export type TweetField = {
  id: string;
  created_at: string;
  text: string;
  author_id: string;
};

export type StreamResult = {
  data: TweetField;
  includes: {
    users: UserField[];
  };
  matching_rules: MatchingRule[];
};

export type SearchResult = {
  data?: TweetField[];
  includes?: {
    users: UserField[];
  };
  meta?: {
    newest_id?: string;
    oldest_id?: string;
    result_count: number;
    next_token?: string;
  };
};

type SearchError = {
  parameters: unknown[];
  message?: string;
};

export type SearchErrorResponse = {
  errors: SearchError[];
  title: string;
  detail?: string;
  type?: string;
};
