import mongoose, { Schema, Document, Model } from 'mongoose';

type SettingDocument = Document & {
  key: string;
  value: string | null;
};

type SettingInput = {
  key: SettingDocument['key'];
  value: SettingDocument['value'];
};

const settingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: { index: true },
    },
    value: {
      type: String,
      default: null,
    },
  },
  {
    collection: 'settings',
    timestamps: true,
  },
);

const Setting: Model<SettingDocument> = mongoose.model('Setting', settingSchema);

export { SettingDocument, SettingInput, Setting };
