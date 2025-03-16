import { asyncHandler } from "../utils/asynHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {connection} from '../index.js'

const toggleSub = asyncHandler(async (req,res)=>{
    const subscriber = req.user.user_id;
    const {sub_to} = req.params;
    console.log(sub_to);

    const [result] = await connection.query(`
        insert into subscriptions (subscriber_id, subscribed_to_id)
        values(?,?)`, [subscriber, sub_to]);
    //console.log(result);        
    if(!result){
        throw new ApiError(400, "could not subscribe try again");
    }
    return res.status(200).json(
        new ApiResponse(result, "Subscribed")
    )
    
})

const getsubscriberList = asyncHandler(async(req,res)=>{//for seeing own subcribers
    const user_id = req.user.user_id;
    if(!user_id){
        throw new ApiError(400, "userid required to search subscriber")
    }
    const [result] = await connection.query(`
        select * from subscriptions
        where subscribed_to_id =?`, [user_id]);
    if(!result){
        throw new ApiError(400, "error while retreiving data")
    }
    return res.status(200).json(new ApiResponse(result))
})

const getsubscribedtoList = asyncHandler(async(req, res)=>{//for seeing channels i have subscribed
    const user_id = req.user.user_id;
    if(!user_id){
        throw new ApiError(400, "userid required to search subscriber")
    }
    const [result] = await connection.query(`
        select * from subscriptions
        where subscriber_id =?`, [user_id]);
    if(!result){
        throw new ApiError(400, "error while retreiving data")
    }
    return res.status(200).json(new ApiResponse(result))
})

const getsubcount = asyncHandler(async(req,res)=>{//for getting count of subscribers of 'x' channel
    const {user_id} = req.params;
    if(!user_id){
        throw new ApiError(400, "userid required to search subscriber")
    }
    const [result]= await connection.query(`
        select count(*) from subscriptions
        where subscribed_to_id=?`,[user_id]);
    if(!result){
        throw new ApiError(400, "error while retreiving data")
    }
    return res.status(200).json(new ApiResponse(result[0]));

})
export {
    toggleSub,
    getsubscriberList,
    getsubscribedtoList,
    getsubcount
}