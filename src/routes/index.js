import { Router } from "express";
import accessRoute from "./access/index.js";

const indexRoute = Router();

indexRoute.use("/auth", accessRoute);

export default indexRoute;
