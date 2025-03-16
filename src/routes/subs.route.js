import { Router } from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js"
import { 
    toggleSub,
    getsubscriberList,
    getsubscribedtoList,
    getsubcount
 } from "../controllers/subs.controller.js";

const subsRouter = Router();
subsRouter.use(authMiddleware);


subsRouter.route('/subscribe/:sub_to').post(toggleSub);
subsRouter.route('/subscriber-list').get(getsubscriberList);
subsRouter.route('/subscribedto-list').get(getsubscribedtoList);
subsRouter.route('/subcount/:user_id').get(getsubcount);

export default subsRouter;