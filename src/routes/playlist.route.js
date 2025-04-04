import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist } from "../controllers/playlist.controller.js";


const playlistRouter = Router()

playlistRouter.use(authMiddleware)

playlistRouter.route('/create-playlist').post(createPlaylist)
playlistRouter.route('/add-video-to-playlist/').post(addVideoToPlaylist)
playlistRouter.route('/remove-video-from-playlist').delete(removeVideoFromPlaylist)
playlistRouter.route('/get-user-playlists').get(getUserPlaylists)
playlistRouter.route('/get-playlist-byId/:playlist_id').get(getPlaylistById)
playlistRouter.route('/delete-playlist/:playlist_id').delete(deletePlaylist)


export default playlistRouter;