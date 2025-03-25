import { asyncHandler } from "../utils/asynHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {connection} from '../index.js'


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {video_id} = req.params
    const {page = 1, limit = 10} = req.query
    const offset = (page-1)* limit;

    if(!video_id){
        throw new ApiError("No video_id found")
    }

    const [comments] = await connection.query(`
        SELECT comments.*, users.fullName 
        FROM comments
        JOIN users ON comments.user_id = users.user_id
        WHERE comments.video_id = ?
        LIMIT ? OFFSET ?`, [video_id, limit, offset]);
    
    if (!comments || comments.length === 0) {
        throw new ApiError("No comments found or error while fetching comments");
    }
    
    return res.status(200).json(new ApiResponse(comments));
    
})

const addComment = asyncHandler(async (req, res) => {
    
    const {video_id} = req.params
    const user_id = req.user.user_id; 

    const {comment_text} =  req.body;
    console.log(comment_text)
    if(!comment_text){
        throw new ApiError("Comment not found")
    }
    if(!video_id){
        throw new ApiError("video_id not found")
    }

    const [result]= await connection.query(`
        insert into comments (user_id, video_id, comment_text)
        values(?,?,?)`, [user_id, video_id, comment_text])
    
    const [addedComment] = await connection.query(`
        select * from comments
        where user_id = ? and comment_id =?`,[user_id , result.insertId])
    if(!result) {
        throw new ApiError("error while posting comment")
    }
    return res.status(200).json(new ApiResponse({comment_id :addedComment[0].comment_id,comment_text,user_id,video_id,fullName:req.user.fullName}))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    
    const {comment_id} = req.params;
    if(!comment_id){
        throw new ApiError("comment_id not found")
    }

    const user_id = req.user.user_id;

    const [result] = await connection.query(`
        delete from comments
        where comment_id = ? and user_id=?`, [comment_id,user_id])

    if(!result){throw new ApiError("error while deleting the comment ")}

    return res.status(200).json("comment deleted")
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }