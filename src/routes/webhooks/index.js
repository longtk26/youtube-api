import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import webhookController from "../../controllers/webhook.controller.js";


const webhookRoute = Router();

webhookRoute.post("/upload-video", asyncHandler(webhookController.handleCompleteUploadVideo))


export default webhookRoute;