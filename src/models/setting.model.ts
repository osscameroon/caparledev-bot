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

const findOrCreateSetting = async (key: string, value: string | null) => {
  const setting = await Setting.findOne({ key });

  if (!setting) {
    const [setting] = await Setting.create([{ key, value }]);

    return setting;
  }

  return setting;
};

export { SettingDocument, SettingInput, Setting, findOrCreateSetting };
