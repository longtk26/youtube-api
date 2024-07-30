import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import videosController from "../../controllers/videos.controller.js";
import upload from "../../config/multer.config.js";

const videoRoute = Router();

videoRoute.use(authentication);
videoRoute.post(
  "/new",
  upload.fields([
    { name: "video_thumbnail", maxCount: 1 },
    { name: "video_file", maxCount: 1 },
  ]),
  asyncHandler(videosController.postVideo)
);
videoRoute.post(
  "/uploads",
  upload.array("videos", 15),
  asyncHandler(videosController.uploadMultiVideos)
);

videoRoute.get("/", () => {});

videoRoute.get("/:videoId", () => {});
videoRoute.patch("/:videoId", () => {});
videoRoute.delete("/:videoId", () => {});

export default videoRoute;
