import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import commentController from "../../controllers/comment.controller.js";
import { authentication } from "../../middlewares/auth.middleware.js";

const commentRoute = Router();

commentRoute.get("/", asyncHandler(commentController.getComments));

commentRoute.use(authentication);
commentRoute.post("/new", asyncHandler(commentController.postComment));
commentRoute.delete("/", asyncHandler(commentController.deleteComments));

export default commentRoute;
