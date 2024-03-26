import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import videosController from "../../controllers/videos.controller.js";
import upload from "../../config/multer.config.js";
import VideoValidate from "../../validator/videos.validate.js";

const videoRoute = Router();

videoRoute.use(authentication);
videoRoute.post(
  "/new",
  // VideoValidate.postVideoValidate(),
  upload.fields([
    { name: "video_thumbnail", maxCount: 1 },
    { name: "video_file", maxCount: 1 },
  ]),
  asyncHandler(videosController.postVideo)
);
videoRoute.get("/", () => {});
videoRoute.get("/:videoId", () => {});
videoRoute.patch("/:videoId", () => {});
videoRoute.delete("/:videoId", () => {});

export default videoRoute;
