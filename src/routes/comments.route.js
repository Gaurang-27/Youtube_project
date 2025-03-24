import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    } from '../controllers/comment.controller.js'

const commentRouter = Router();


commentRouter.route('/add-comment').post(authMiddleware, addComment)
commentRouter.route('/get-comments').get(getVideoComments)
commentRouter.route('/delete-comment').delete(authMiddleware,deleteComment)

export default commentRouter