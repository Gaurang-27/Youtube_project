import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser"
//import bodyParser from "body-parser"
const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

//importing routes
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import subsRouter from "./routes/subs.route.js";
import commentRouter from "./routes/comments.route.js";
import playlistRouter from "./routes/playlist.route.js";
import reactionRouter from "./routes/reaction.route.js";
//route declaration
app.use('/users',userRouter);
app.use('/videos',videoRouter);
app.use('/subs',subsRouter)
app.use('/comment', commentRouter)
app.use('/playlist',playlistRouter)
app.use('/reaction',reactionRouter)
export {app};


