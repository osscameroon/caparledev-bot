import mongoose, { Document, Model, Schema } from 'mongoose';

type UserDocument = Document & {
  id: string;
  username: string;
  name: string;
  createDate: Date;
  location: string | null;
  upsert: (userInput: UserInput) => Promise<UserDocument[] | UserDocument | undefined>;
};

type UserInput = {
  id: UserDocument['id'];
  username: UserDocument['username'];
  createDate: UserDocument['createDate'];
  name: UserDocument['name'];
  location: UserDocument['location'];
};

const userSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

const User: Model<UserDocument> = mongoose.model('User', userSchema);

const upsertUser = async (userInput: UserInput) => {
  const user = await User.exists({ id: userInput.id });

  if (!user) {
    return User.create([userInput]);
  }

  return User.updateOne({ id: userInput.id }, userInput);
};

export { UserDocument, User, UserInput, upsertUser };
