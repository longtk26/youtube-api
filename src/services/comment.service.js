import { NotFoundError } from "../core/error.response.js";
import Comment from "../models/comment.model.js";
import { getComments } from "../models/repositories/comment.repo.js";
import { findVideoById } from "../models/repositories/video.repo.js";

class CommentService {
  static async postComment({
    comment_userId,
    comment_videoId,
    comment_content,
    comment_parrentId,
  }) {
    const newComment = await Comment.create({
      comment_content,
      comment_userId,
      comment_videoId,
      comment_parrentId: comment_parrentId ?? null,
    });

    let commentRight;

    if (!comment_parrentId) {
      commentRight = 1;
      newComment.comment_left = commentRight;
      newComment.comment_right = commentRight + 1;
      await newComment.save();
      return newComment;
    }

    const parrentComment = await Comment.findOne({ _id: comment_parrentId });
    if (!parrentComment) throw new NotFoundError("Comment parrent not found");

    commentRight = parrentComment.comment_right;
    await Comment.updateMany(
      {
        comment_videoId,
        comment_left: { $gt: commentRight },
      },
      {
        $inc: { comment_left: 2 },
      }
    );

    await Comment.updateMany(
      {
        comment_videoId,
        comment_right: { $gte: commentRight },
      },
      {
        $inc: { comment_right: 2 },
      }
    );

    newComment.comment_left = commentRight;
    newComment.comment_right = commentRight + 1;
    await newComment.save();

    return newComment;
  }

  static async getCommentsByParrentId({ comment_parrentId, comment_videoId }) {
    return await getComments({
      videoId: comment_videoId,
      parrentId: comment_parrentId,
    });
  }

  static async deleteComments({ comment_id, comment_videoId }) {
    const foundVideo = await findVideoById(comment_videoId);
    if (!foundVideo) throw new NotFoundError("Video not found");

    const foundComment = await Comment.findOne({ _id: comment_id });
    if (!foundComment) throw new NotFoundError("Comment not found");

    const leftValue = foundComment.comment_left;
    const rightValue = foundComment.comment_right;
    const width = rightValue - leftValue + 1;

    await Comment.deleteMany({
      comment_videoId,
      comment_left: { $gte: leftValue },
      comment_right: { $lte: rightValue },
    });

    await Comment.updateMany(
      {
        comment_videoId,
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );

    await Comment.updateMany(
      {
        comment_videoId,
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );

    return true;
  }
}

export default CommentService;
