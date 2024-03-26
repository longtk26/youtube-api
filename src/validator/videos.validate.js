import { body, checkExact } from "express-validator";
import validate from "./index.validate.js";

class VideoValidate {
  static postVideoValidate() {
    return validate([
      body("video_channel_id")
        .isString()
        .withMessage("video_channel_id is string")
        .isLength({ min: 24, max: 24 })
        .withMessage("video_channel_id is required with 24 characters"),
      body("video_title")
        .notEmpty()
        .isString()
        .withMessage("video_title is required"),
      body("video_suitable_user")
        .notEmpty()
        .isString()
        .withMessage("video_suitable_user is required"),
      body("video_description")
        .optional()
        .isString()
        .withMessage("video_description is string"),
      body("video_file").notEmpty().withMessage("video_file is required)"),
      checkExact(),
    ]);
  }
}

export default VideoValidate;
