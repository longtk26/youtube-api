import { mongoose, Schema } from "mongoose";

const DOCUMENT_NAME = "video";
const COLLECTION_NAME = "videos";

const videoSchema = new Schema(
  {
    video_channel_id: {
      type: Schema.Types.ObjectId,
      ref: "channel",
    },
    video_title: {
      type: String,
      required: true,
      trim: true,
    },
    video_file: {
      type: String,
      default: ""
    },
    video_thumbnail: {
      type: String,
      default: "",
    },
    video_suitable_user: {
      type: String,
      enum: ["above 18", "below 18", "all"],
      required: true,
    },
    video_description: {
      type: String,
      default: "",
    },
    video_views_amount: {
      type: Number,
      default: 0,
    },
    video_likes_amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const Video = mongoose.model(DOCUMENT_NAME, videoSchema);

export default Video;
