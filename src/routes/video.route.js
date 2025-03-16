import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"
import {
    publishVideo
} from '../controllers/video.controller.js'

const videoRouter = Router();

videoRouter.route('/publish-video').post(
    authMiddleware,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
        
    ]),
    publishVideo
)

export default videoRouter;