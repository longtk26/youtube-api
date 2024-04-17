import { Router } from "express";
import accessRoute from "./access/index.js";
import channelRoute from "./channels/index.js";
import videoRoute from "./videos/index.js";
import commentRoute from "./comments/index.js";

const indexRoute = Router();

indexRoute.use("/auth", accessRoute);
indexRoute.use("/channels", channelRoute);
indexRoute.use("/videos", videoRoute);
indexRoute.use("/comments", commentRoute);

export default indexRoute;
