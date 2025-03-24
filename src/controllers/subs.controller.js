import { asyncHandler } from "../utils/asynHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {connection} from '../index.js'

const toggleSub = asyncHandler(async (req,res)=>{
    const subscriber = req.user.user_id;
    const {sub_to} = req.params;
   // console.log(subscriber, sub_to)
    //console.log(sub_to);
    
    //if already sub then we need to unsubscribe
    const [checkifsubscribed] = await connection.query(`
        select * from subscriptions
        where subscribed_to_id = ? and subscriber_id=?`,[sub_to, subscriber]);
    if(checkifsubscribed[0]){
        await connection.query(`
            delete from subscriptions
            where subscribed_to_id = ? and subscriber_id=?`,[sub_to, subscriber]);
        
        return res.status(200).json(new ApiResponse({subscribed : false}))
    }
    const [result] = await connection.query(`
        insert into subscriptions (subscriber_id, subscribed_to_id)
        values(?,?)`, [subscriber, sub_to]);
    //console.log(result);        
    if(!result){
        throw new ApiError(400, "could not subscribe try again");
    }
    return res.status(200).json(
        new ApiResponse({subscribed : true})
    )
    
})

const getsubscriberList = asyncHandler(async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        throw new ApiError(400, "User ID is required to search subscribers");
    }

    const [result] = await connection.query(`
            SELECT 
        u1.user_id AS subscriber_id, 
        u1.username AS subscriber_username, 
        u1.fullName AS subscriber_fullName,
        u1.avatar AS subscriber_avatar,
        u2.username AS requested_user_username, 
        u2.fullName AS requested_user_fullName,
        u2.avatar AS requested_user_avatar,
        u2.user_id AS requested_user_id
    FROM subscriptions s
    JOIN users u1 ON s.subscriber_id = u1.user_id
    JOIN users u2 ON s.subscribed_to_id = u2.user_id
    WHERE s.subscribed_to_id = ?;

    `, [user_id]);

    //console.log(result)

    if (!result || result.length === 0) {
        throw new ApiError(400, "Error while retrieving data or no subscribers found");
    }

    return res.status(200).json(new ApiResponse({
        user_username: result[0]?.requested_user_username,
        user_fullName : result[0]?.requested_user_fullName,
        user_id : result[0]?.requested_user_id,
        avatar : result[0]?.requested_user_avatar, // The username of the requested user
        subscribers: result.map(sub => ({
            subscriber_id: sub.subscriber_id,
            username: sub.subscriber_username,
            fullName: sub.subscriber_fullName,
            avatar : sub.subscriber_avatar
        }))
    }));
});



const getsubscribedtoList = asyncHandler(async(req, res)=>{//for seeing channels i have subscribed
    const user_id = req.user.user_id;
    if(!user_id){
        throw new ApiError(400, "userid required to search subscriber")
    }
    const [result] = await connection.query(`
        SELECT u.user_id, u.username, u.fullName
        FROM users u
        JOIN subscriptions s ON u.user_id = s.subscribed_to_id
        WHERE s.subscriber_id = ?`, [user_id]);

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

const checkSubscribed = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const {channel_id} = req.params;

    if(!channel_id) {
        throw new ApiError(400, "channel id required");
    }

    const [result] = await connection.query(`
        select * from subscriptions
        where subscriber_id = ? and subscribed_to_id = ?`, [user_id, channel_id])

    if(!result[0]){
        return res.status(200).json(new ApiResponse({subscribed : false}))
    }
    return res.status(200).json(new ApiResponse({subscribed : true}))
})
export {
    toggleSub,
    getsubscriberList,
    getsubscribedtoList,
    getsubcount,
    checkSubscribed
}