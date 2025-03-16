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
//route declaration
app.use('/users',userRouter);
app.use('/videos',videoRouter);

export {app};


