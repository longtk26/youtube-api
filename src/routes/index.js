import { Router } from "express";
import accessRoute from "./access/index.js";
import channelRoute from "./channels/index.js";

const indexRoute = Router();

indexRoute.use("/auth", accessRoute);
indexRoute.use("/channels", channelRoute);

export default indexRoute;
