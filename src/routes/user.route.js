import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route('/register').post(
    upload.fields([//this will give control to multer middlware and upload file in local storage
        {
            name : "avatar",
            maxCount : 1
        }
        ]),
    registerUser);

export default userRouter;