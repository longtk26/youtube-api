import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import accessController from "../../controllers/access.controller.js";
import { authentication } from "../../middlewares/auth.middleware.js";

const accessRoute = Router();

accessRoute.post("/sign-up", asyncHandler(accessController.signUp));
accessRoute.post("/sign-in", asyncHandler(accessController.signIn));

accessRoute.post("/refresh-token", asyncHandler(accessController.refreshToken));

accessRoute.use(authentication);
accessRoute.post("/sign-out", asyncHandler(accessController.signOut));

export default accessRoute;
