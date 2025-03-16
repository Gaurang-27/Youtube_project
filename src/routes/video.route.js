import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"
import {
    publishVideo,
    getAllVideos,
    getVideoById,
    getVideoByUser
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
videoRouter.route('/').get(getAllVideos)//required query - ?page,limit
videoRouter.route('/userid/:user_id').get(getVideoByUser)//requied query - ?page, limit
videoRouter.route('/videoid/:video_id').get(getVideoById)

export default videoRouter;