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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

export { TweetDocument, Tweet, TweetInput };
