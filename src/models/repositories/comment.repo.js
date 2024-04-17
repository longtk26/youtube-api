import Comment from "../comment.model.js";

const getComments = async ({ videoId, parrentId }) => {
  const comments = Comment.find({
    comment_videoId: videoId,
    comment_parrentId: parrentId,
  });

  return comments;
};

export { getComments };
