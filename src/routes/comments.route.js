import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    } from '../controllers/comment.controller.js'

const commentRouter = Router();


commentRouter.route('/add-comment/:video_id').post(authMiddleware, addComment)
commentRouter.route('/get-comments/:video_id').get(getVideoComments)
commentRouter.route('/delete-comment/:comment_id').delete(authMiddleware,deleteComment)

export default commentRouter