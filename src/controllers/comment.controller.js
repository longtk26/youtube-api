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

  async getCommentsFirstLaunchVideo(req, res) {
    const data = await CommentService.getCommentsByVideoId({
      comment_videoId: req.params.videoId,
    });

    return new SuccessResponse({
      metadata: data,
      message: "Get Comments successfully!",
    }).send(res);
  }

  async getCommentsChild(req, res) {
    const data = await CommentService.getCommentsByParrentId({
      comment_videoId: req.query.videoId,
      comment_parrentId: req.query.parrentId,
    });

    return new SuccessResponse({
      metadata: data,
      message: "Get Comments successfully!",
    }).send(res);
  }
}

export default new CommentController();
