import { NotFoundError } from "../../core/error.response.js";
import Comment from "../comment.model.js";

const addNumbersOfResponse = async (comments = [], videoId) => {
  let commentsResult = [];

  for (const comment of comments) {
    const commentsChild = await Comment.find({
      comment_videoId: videoId,
      comment_parrentId: comment._id,
    });

    const numbersOfResponse = commentsChild.length;

    commentsResult.push({
      ...comment,
      numbersOfResponse,
    });
  }

  return commentsResult;
};

const getComments = async ({ videoId, parrentId }) => {
  if (!parrentId) {
    const comments = await Comment.find({
      comment_videoId: videoId,
      comment_parrentId: null,
    }).lean();

    const commentsResult = await addNumbersOfResponse(comments, videoId);

    return commentsResult;
  }

  const commentParent = await Comment.findOne({ _id: parrentId }).lean();
  if (!commentParent) throw new NotFoundError("Comment parrent not found");

  const comments = await Comment.find({
    comment_videoId: videoId,
    comment_parrentId: parrentId,
  }).lean();

  const commentsResult = await addNumbersOfResponse(comments, videoId);

  return commentsResult;
};

export { getComments };
