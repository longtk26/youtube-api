import { mongoose, Schema } from "mongoose";

const DOCUMENT_NAME = "keystore";
const COLLECTION_NAME = "keystores";

const keyStoreSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    publickey: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const KeyStore = mongoose.model(DOCUMENT_NAME, keyStoreSchema);

export default KeyStore;
