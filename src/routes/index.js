import { Router } from "express";
import accessRoute from "./access/index.js";
import channelRoute from "./channels/index.js";
import videoRoute from "./videos/index.js";
import commentRoute from "./comments/index.js";
import oauthRoute from "./oauth/index.js";
import webhookRoute from "./webhooks/index.js";

const indexRoute = Router();

// Web hook
indexRoute.use("/webhooks", webhookRoute);

// Main api
indexRoute.use("/auth", accessRoute);
indexRoute.use("/oauth", oauthRoute);
indexRoute.use("/channels", channelRoute);
indexRoute.use("/videos", videoRoute);
indexRoute.use("/comments", commentRoute);

export default indexRoute;
