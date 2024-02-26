import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import channelsController from "../../controllers/channels.controller.js";

const channelRoute = Router();

channelRoute.get(
  "/:channelId",
  asyncHandler(channelsController.getChannelByVistor)
);

channelRoute.use(authentication);

channelRoute.post("/new", asyncHandler(channelsController.createChannel));
channelRoute.get("/", asyncHandler(channelsController.getChannelByUser));
channelRoute.patch("/:id", () => {});
channelRoute.delete("/:id", () => {});

export default channelRoute;
