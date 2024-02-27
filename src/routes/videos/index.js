import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.js";

const videoRoute = Router();

videoRoute.use(authentication);
videoRoute.post("/new", () => {});
videoRoute.get("/", () => {});
videoRoute.get("/:videoId", () => {});
videoRoute.patch("/:videoId", () => {});
videoRoute.delete("/:videoId", () => {});

export default videoRoute;
