import mongoose, { Document, Model, Schema } from 'mongoose';

type TweetDocument = Document & {
  id: string;
  text: string;
  createDate: Date;
  retweeted: boolean;
  author: string;
};

type TweetInput = {
  id: TweetDocument['id'];
  text: TweetDocument['text'];
  createDate: TweetDocument['createDate'];
  retweeted: TweetDocument['retweeted'];
  author: TweetDocument['author'];
};

/**
 * Mongo Schema for Tweet
 */
const tweetSchema: Schema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createDate: {
      type: Date,
      require: true,
    },
    retweeted: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ref: (_instance: any, _doc: any) => 'id',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'tweets',
  },
);

const Tweet: Model<TweetDocument> = mongoose.model('Tweet', tweetSchema);

const upsertTweet = async (tweetInput: TweetInput) => {
  const tweet = await Tweet.exists({ id: tweetInput.id });

  if (!tweet) {
    return Tweet.create([tweetInput]);
  }

  return;
};

export { TweetDocument, Tweet, TweetInput, upsertTweet };
