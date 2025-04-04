import { Router } from "express";
import { getReactionCount, getReactionStatus, toggleReaction } from "../controllers/reaction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const reactionRouter = Router()

reactionRouter.route('/get-reaction-count/:video_id').get(getReactionCount)
reactionRouter.route('/get-reaction-status/:video_id').get(authMiddleware, getReactionStatus)
reactionRouter.route('/toggle-reaction').post(authMiddleware, toggleReaction)

export default reactionRouter;