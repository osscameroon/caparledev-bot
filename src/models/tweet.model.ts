import mongoose, { Document, Model, Schema } from 'mongoose';

type TweetDocument = Document & {
  id: string;
  text: string;
  createDate: Date;
  retweeted: boolean;
  user: {
    id: string;
    username: string;
    name: string;
    createDate: Date;
    location: string | null;
  };
};

type TweetInput = {
  id: TweetDocument['id'];
  text: TweetDocument['text'];
  createDate: TweetDocument['createDate'];
  retweeted: TweetDocument['retweeted'];
  user: TweetDocument['user'];
};

const userSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    default: null,
  },
});

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
    user: userSchema,
  },
  {
    timestamps: true,
    collection: 'tweets',
  },
);

const Tweet: Model<TweetDocument> = mongoose.model('Tweet', tweetSchema);

export { TweetDocument, Tweet, TweetInput };
