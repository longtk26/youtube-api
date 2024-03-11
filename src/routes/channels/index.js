import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import channelsController from "../../controllers/channels.controller.js";
import upload from "../../config/multer.config.js";

const channelRoute = Router();

channelRoute.get(
  "/:channelId",
  asyncHandler(channelsController.getChannelByVistor)
);

// Authentication routes
channelRoute.use(authentication);

channelRoute.post(
  "/new",
  upload.single("channel_image"),
  asyncHandler(channelsController.createChannel)
);

channelRoute.get("/", asyncHandler(channelsController.getChannelByUser));
channelRoute.patch(
  "/",
  upload.single("channel_image"),
  asyncHandler(channelsController.updateChannel)
);
channelRoute.delete(
  "/:channelId",
  asyncHandler(channelsController.deleteChannel)
);

export default channelRoute;
