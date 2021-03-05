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
    collection: 'tweets',
  },
);

const User: Model<UserDocument> = mongoose.model('User', userSchema);

userSchema.statics.upsert = async (userInput: UserInput) => {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self: Model<UserDocument> = this;

  const user = self.exists({ id: userInput.id });

  if (!user) {
    return self.create([userInput]);
  }

  return self.updateOne({ id: userInput.id }, userInput);
};

export { UserDocument, User, UserInput };
