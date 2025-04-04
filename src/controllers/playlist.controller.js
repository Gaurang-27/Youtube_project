import { asyncHandler } from "../utils/asynHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {connection} from '../index.js'

const createPlaylist = asyncHandler(async (req, res) => {
    let {name, description} = req.body

    if(!name){
        throw new ApiError(400,"name is required needed")
    }
    if(!description){description = name}

    const user_id = req.user.user_id;

    const [result] = await connection.query(`
        insert into playlists (name, description, user_id) values(?,?,?)`, [name, description, user_id])

    if(!result){
        throw new ApiError(400, "error while creating playlist")
    }

    return res.status(200).json(new ApiResponse(result.insertId , "playlist created"))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    
    const user_id = req.user.user_id ;

    const [result] = await connection.query(`
        select * from playlists
        where user_id =?`,[user_id])
    
    if(!result){
        throw new ApiError(400, "error while retrieving playlists")
    }

    return res.status(200).json(new ApiResponse(result))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlist_id} = req.params

    if(!playlist_id){
        throw new ApiError(400, "playlist_id not found")
    }

    const [result] = await connection.query(`
        SELECT *
        FROM videos v
        JOIN playlist_videos pv ON v.video_id = pv.video_id
        WHERE pv.playlist_id = ?;`,[playlist_id])

    if(!result){
        throw new ApiError(400, "error while retrieving playlists")
    }

    return res.status(200).json(new ApiResponse(result))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlist_id, video_id} = req.query

    if(!playlist_id || !video_id){
        throw new ApiError(400, "playlist_id and video_id are required")
    }

    const [ifExist] = await connection.query(`
        select * from playlist_videos
        where playlist_id =? and video_id =?`,[playlist_id,video_id])
    if(ifExist.length>0){
        return res.status(200).json(new ApiResponse({exist:true}))
    }

    const [result] = await connection.query(`
        insert into playlist_videos (playlist_id , video_id)
        values(?,?)`,[playlist_id, video_id])

    if(!result){
        throw new ApiError(400, "error while adding video")
    }

    return res.status(200).json(new ApiResponse({...result,exist:false}))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlist_id , video_id} = req.query

    if(!playlist_id || !video_id){
        throw new ApiError(400, "playlist_id and video_id are required")
    }

    const [result] = await connection.query(`
        delete from playlist_videos
        where video_id = ? and playlist_id = ?`, [video_id, playlist_id])
    
    if(!result){
         throw new ApiError(400, "error while deleting video")
    }
    
    return res.status(200).json(new ApiResponse(result))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlist_id} = req.params

    if(!playlist_id){throw new ApiError(400, "playlist_id not found")}

    const [result] = await connection.query(`
        delete from playlists
        where playlist_id = ?`,[playlist_id])

    if(!result){
        throw new ApiError(400, "error while deleting playlist0")
    }
       
    return res.status(200).json(new ApiResponse(result))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}