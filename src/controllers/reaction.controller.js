import { asyncHandler } from "../utils/asynHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {connection} from '../index.js'

const getReactionStatus = asyncHandler(async (req,res)=>{

    const user_id = req.user.user_id;
    const {video_id} = req.params;

    if(!video_id){throw new ApiError(400,"video_id required")}

    const [result] = await connection.query(`
        SELECT * 
        FROM reactions 
        WHERE user_id = ? AND video_id = ?;
        `,[user_id, video_id])

    if(result.length==0){ return res.status(200).json(new ApiResponse({reaction_type:"none"}))}

    return res.status(200).json(new ApiResponse(result[0]))
})

const getReactionCount = asyncHandler(async(req, res)=>{

    //const user_id = req.user.user_id;
    const {video_id} = req.params;

    if(!video_id){
        throw new ApiError(400, "video_id required")
    }

    const [result] = await connection.query(`
        SELECT 
        reaction_type, 
        COUNT(*) AS count 
        FROM reactions 
        WHERE video_id = ? 
        GROUP BY reaction_type
        ORDER BY 
            reaction_type = 'like' DESC, 
            reaction_type = 'dislike' DESC;`,[video_id]);


        if(!result){
            throw new ApiError(400, "error while retrieving reactions")
        }
    
        return res.status(200).json(new ApiResponse(result))
})

const toggleReaction = asyncHandler(async(req, res)=>{

    const user_id = req.user.user_id;
    const {video_id,reaction_type=null} = req.query;

    if(!video_id){throw new ApiError(400,"video_id required")}

    const [result] = await connection.query(`
        SELECT reaction_type 
        FROM reactions 
        WHERE user_id = ? AND video_id = ?;
        `,[user_id, video_id]);

    //cases-
    //1.add a new reaction whether like or dislike
    //2.change existing reaction example like to dislike
    //3.delete existing reaction
    //edge case - clicking on like even if already liked
    
    if(result.length == 0 && reaction_type!=null){
        const [addReaction] = await connection.query(`
            insert into reactions (user_id, video_id , reaction_type)
            values(?,?,?)`,[user_id , video_id , reaction_type])

        if(!addReaction){
            throw ApiError(400, "error while adding reaction")
        }
        return res.status(200).json(new ApiResponse(addReaction, 'reaction added'))
    }
    
    if(reaction_type!=null && reaction_type!=result[0].reaction_type){

        const [changeReaction] = await connection.query(`
            update reactions
            set reaction_type =? 
            where user_id =? and video_id = ?`, [reaction_type , user_id, video_id])
        
        if(!changeReaction){throw new ApiError(400, "error while changing reaction")}

        return res.status(200).json(new ApiResponse(changeReaction , "reaction changed"))
    }

    if(result.length!=0 && reaction_type==result[0].reaction_type){

        const [removeReaction] = await connection.query(`
            delete from reactions
            where video_id = ? and user_id =?`,[video_id ,user_id])
        
        if(!removeReaction) {throw new ApiError(400, "error while deleting reaction")}

        return res.status(200).json(new ApiResponse(removeReaction, 'reaction removed'))
    }

    return res.status(200).json(new ApiResponse("invalid request"))   

})

export {
    getReactionCount,
    getReactionStatus,
    toggleReaction
}