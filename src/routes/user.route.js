import { Router } from "express";
import { registerUser ,loginUser } from "../controllers/user.controller.js";
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

userRouter.route('/login').post(loginUser);

//secured routes
//userRouter.route('/logout').post();

export default userRouter;