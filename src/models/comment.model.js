import { mongoose, Schema } from "mongoose";

const DOCUMENT_NAME = "comment";
const COLLECTION_NAME = "comments";

const commentSchema = new Schema(
  {
    comment_userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    comment_parrentId: {
      type: Schema.Types.ObjectId,
    },
    comment_videoId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "video",
    },
    comment_content: {
      type: String,
      required: true,
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_like_amount: {
      type: Number,
      default: 0,
    },
    comment_dislike_amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const Comment = mongoose.model(DOCUMENT_NAME, commentSchema);

export default Comment;
