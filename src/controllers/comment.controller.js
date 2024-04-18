import { Created, SuccessResponse } from "../core/success.response.js";
import CommentService from "../services/comment.service.js";

class CommentController {
  async postComment(req, res) {
    const data = await CommentService.postComment({
      ...req.body,
      comment_userId: req.user.userId,
    });

    return new Created({
      metadata: data,
      message: "Created Comment successfully!",
    }).send(res);
  }

  async getComments(req, res) {
    const data = await CommentService.getCommentsByParrentId({
      comment_videoId: req.query.videoId,
      comment_parrentId: req.query.parrentId,
    });

    return new SuccessResponse({
      metadata: data,
      message: "Get Comments successfully!",
    }).send(res);
  }

  async deleteComments(req, res) {
    const data = await CommentService.deleteComments(req.body);

    return new SuccessResponse({
      metadata: data,
      message: "Delete Comments successfully!",
    }).send(res);
  }
}

export default new CommentController();
