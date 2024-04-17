import { NotFoundError } from "../core/error.response.js";
import Comment from "../models/comment.model.js";
import { getComments } from "../models/repositories/comment.repo.js";

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

  static async getCommentsByVideoId({ comment_videoId }) {
    return await getComments({ videoId: comment_videoId, parrentId: null });
  }

  static async getCommentsByParrentId({ comment_parrentId, comment_videoId }) {
    return await getComments({
      videoId: comment_videoId,
      parrentId: comment_parrentId,
    });
  }
}

export default CommentService;
