import { Router } from "express";
import { registerUser 
    ,loginUser 
    ,logoutUser
    ,revalidateTokens
    ,getUserDetails} 
    from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"

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
userRouter.route('/logout').post(
    authMiddleware,
    logoutUser
);
userRouter.route('/revalidate-token').post(revalidateTokens);
userRouter.route('/user-date').get(authMiddleware, getUserDetails);
export default userRouter;