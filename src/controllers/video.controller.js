import { asyncHandler } from "../utils/asynHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import {connection} from '../index.js'
import jwt from "jsonwebtoken"
import { createAccessToken, createRefreshToken } from "../middlewares/tokens.middleware.js";

const publishVideo = asyncHandler(async (req,res)=>{
    //first authmiddleware will check if user is logged in
    const {title,description} =req.body;
    if(!title){
        throw new ApiError(400, "Video Title required")
    }
    if(!description){
        description = title;
    }
    
    const thumbnail = req.files?.thumbnail?.[0]?.path;
    if(!thumbnail){
        throw new ApiError(400, "Thumbnail required")
    }

    const videoFile = req.files?.videoFile?.[0]?.path;
    if(!videoFile){
        throw new ApiError(400,"Video file required");
    }

    const uploadVideo = await uploadOnCloudinary(videoFile);
    if(!uploadVideo){
        throw new ApiError(400, "Could not uplaod video");
    }
    const uploadThumbnail = await uploadOnCloudinary(thumbnail);
    if(!uploadThumbnail){
        throw new ApiError(400, "Could not upload thumbnail")
    }

    const user_id = req.user.user_id;
    const [insertVideo] = await connection.query(`
        insert into videos (user_id, title, description , video_url, thumbnail_url)
        values(?,?,?,?,?)`
    ,[user_id, title, description, uploadVideo.url, uploadThumbnail.url]);
    const video_id=insertVideo?.insertId;

    const [videoDetails] = await connection.query(
        `select * from videos
        where video_id=?`, [video_id]
    )

    return res.status(200).json(
        new ApiResponse(videoDetails[0])
    )

})  

const getAllVideos = asyncHandler(async (req,res)=>{
    const {limit = 10 , page = 1} = req.query;

    const offset= (page-1)*limit;
    const [result] = await connection.query(`
        select * from videos
        order by uploaded_at
        limit ? offset ?`, [limit ,offset]);
    if(!result) {
        throw new ApiError(400, "could not retrieve content");
    }

    return res.status(200).json(
        new ApiResponse (result)
    )
})

const getVideoByUser= asyncHandler(async (req,res)=>{
    const {limit =10 , page =1} = req.query;
    const offset = (page-1)* limit;
    const user_id = req.params;
    //console.log(user_id.user_id);

    if(!user_id) {
        throw new ApiError(400, "user_id required");
    }

    const [user] = await connection.query(`select fullName from users where user_id = ?`, [user_id.user_id]);
    if(!user[0]){
        throw new ApiError(404, "User does not exist");
    }
    const [videos] = await connection.query(`
        select * from videos
        where user_id = ?
        order by uploaded_at
        limit ? offset ?`, [user_id.user_id,limit,offset]);
    return res.status(200).json(
        new ApiResponse(videos)
    ) 
})

const getVideoById= asyncHandler( async (req,res)=>{
    const video_id=req.params;
    if(!video_id){
        throw new ApiError(400, "video id is required to find video");
    }

    const [video]= await connection.query("select * from videos where video_id =?", [video_id.video_id]);
    if(!video[0]){
        throw new ApiError(404, "video not found");

    }
    return res.status(200).json(
        new ApiResponse(video[0])
    )
})

//video delete controller

export {
    publishVideo,
    getAllVideos,
    getVideoById,
    getVideoByUser
}