import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import accessController from "../../controllers/access.controller.js";

const accessRoute = Router();

accessRoute.post("/sign-up", asyncHandler(accessController.signUp));
accessRoute.post("/sign-in", (req, res) => {});
accessRoute.post("/sign-out", (req, res) => {});

export default accessRoute;
