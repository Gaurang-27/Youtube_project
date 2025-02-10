import express from "express";
import cors from 'cors'
const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//importing routes
import userRouter from "./routes/user.route.js";
//route declaration
app.use('/users',userRouter);

export {app};


