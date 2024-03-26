import { mongoose, Schema } from "mongoose";

const DOCUMENT_NAME = "channel";
const COLLECTION_NAME = "channels";

const channelSchema = new Schema(
  {
    channel_user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    channel_name: {
      type: String,
      required: true,
    },
    channel_description: {
      type: String,
      trim: true,
    },
    channel_image: {
      type: String,
    },
    channel_amount_subscribers: {
      type: Number,
      default: 0,
    },
    channel_subscribers: [
      {
        type: Schema.Types.ObjectId,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const Channel = mongoose.model(DOCUMENT_NAME, channelSchema);

export default Channel;
