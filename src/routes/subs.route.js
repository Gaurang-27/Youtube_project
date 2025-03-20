import { Router } from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js"
import { 
    toggleSub,
    getsubscriberList,
    getsubscribedtoList,
    getsubcount,
    checkSubscribed
 } from "../controllers/subs.controller.js";

const subsRouter = Router();
//subsRouter.use(authMiddleware);


subsRouter.route('/subscribe/:sub_to').post(authMiddleware, toggleSub);
subsRouter.route('/subscriber-list/:user_id').get(getsubscriberList);
subsRouter.route('/subscribedto-list').get(authMiddleware, getsubscribedtoList);
subsRouter.route('/subcount/:user_id').get(authMiddleware, getsubcount);
subsRouter.route('/checksubscribed/:channel_id').get(authMiddleware, checkSubscribed)

export default subsRouter;