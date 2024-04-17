import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import commentController from "../../controllers/comment.controller.js";
import { authentication } from "../../middlewares/auth.middleware.js";

const commentRoute = Router();

commentRoute.get(
  "/:videoId",
  asyncHandler(commentController.getCommentsFirstLaunchVideo)
);
commentRoute.get("/", asyncHandler(commentController.getCommentsChild));

commentRoute.use(authentication);
commentRoute.post("/new", asyncHandler(commentController.postComment));

export default commentRoute;
