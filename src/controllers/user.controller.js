import { asyncHandler } from "../utils/asynHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import {connection} from '../index.js'
import jwt from "jsonwebtoken"
import { createAccessToken, createRefreshToken } from "../middlewares/tokens.middleware.js";

const generateTokens = async (userid)=>{
    try {
        //finding the user using the userid and then generating tokens
        // const [user] = await connection.query(`
        //     select * from users 
        //     where user_id  = ?`,[userid])
        const accessToken = await createAccessToken(userid);
        const refreshToken = await createRefreshToken(userid);
        //console.log(accessToken, refreshToken);
        
        //updating the refreshtoken into the database
        await connection.query(`
            update users
            set refreshToken = ? 
            where user_id = ?`, [refreshToken, userid])

        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}

const optionsforCookies = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",//false for local host only
    sameSite: "lax",
}

const registerUser = asyncHandler( async (req,res,next) =>{
    
    //taking data and checking if any value is missing
    const {fullName,email,password,username} = req.body;
    if(
        [fullName,email,password,username].some( 
            (field)=> field?.trim() === "" 
        )
    ){
        throw new ApiError(400,"All fields required");
    }
    const [findUser] = await connection.query(`
        select * from users
        where username=? or email=?` ,[username,email])
    if(findUser[0]) {
        throw new ApiError(409, "User already registered")
    }
    
    //checking if avatar is recieved in input
    const avatarPath = req.files?.avatar?.[0]?.path;
    // console.log(avatarPath);
    // if(!avatarPath){
    //     throw new ApiError(400, "avatar is required");
    // }

    //uploading avatar on cloudinary and checking if it is uploaded correctly
    let uploadAvatar=null
    if(avatarPath){
        uploadAvatar = await uploadOnCloudinary(avatarPath);
        if(!uploadAvatar){
        throw new ApiError(400, "problem in uploading avatar");
        }
    }
    console.log(uploadAvatar);

    const values = [email, fullName, username, password]; // Base values

    let sqlQuery = `
        INSERT INTO users (email, fullName, username, password_hash ${uploadAvatar ? ', avatar' : ''})
        VALUES (?, ?, ?, ? ${uploadAvatar ? ', ?' : ''})
    `;

    if (uploadAvatar) {
        values.push(uploadAvatar.url); // Add avatar only if available
    }

    const [user] = await connection.query(sqlQuery, values);
    const userid = user?.insertId;
    
    const [createdUser]= await connection.query(`
        select * from users
        where user_id=?`,[userid]);


    //user will subscribe to himself by default
    await connection.query("insert into subscriptions (subscriber_id, subscribed_to_id) values(?,?)",
        [userid, userid]
    )

    if(!createdUser[0]){
        throw new ApiError(500, " could not create user");
    }

    return res.status(200).json(
        new ApiResponse(201, createdUser[0], "User registered succesfully")
    );

})

const loginUser =asyncHandler (async (req,res) =>{
    //console.log(typeof req.body);
    const {email,password} = req.body;
    //console.log(email);
    //checking if we got email
    if(!email){
        throw new ApiError(400, "email required")
    }

    //findiing the user using the email
    const [userFind] = await connection.query(`
        select * from users
        where email = ?`,[email])
    if(!userFind[0]){
        throw new ApiError(404,"user not found")
    }

    //validating password upon finding the user
    const validatePassword = await (userFind[0].password_hash === password)
    if(!validatePassword){
        throw new ApiError(401, "invalid credentials")
    }

    //time to generate tokens after validating password
    const {accessToken, refreshToken} =await  generateTokens(userFind[0].user_id);

    //not getting the update user object as old (userFind) still doesnot have refreshtoken
    const [loggedinUser] = await connection.query("select * from users where user_id=?",[userFind[0].user_id])
    delete loggedinUser[0].password_hash;
    delete loggedinUser[0].refreshToken

    //now just send user data back to response
    return res.status(200)
    .cookie("accessToken", accessToken , optionsforCookies)
    .cookie("refreshToken" , refreshToken , optionsforCookies)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedinUser[0] , accessToken , refreshToken
            },
            "Login successful"
        )
    )


})

const logoutUser = asyncHandler(async(req,res)=>{
    //due to the middleware invoked now we will have req.user which has id
    const userid = req.user.user_id;
    await connection.query(`
        update users
        set refreshToken = NULL
        where user_id = ?`, [userid])
    //console.log(userFind.refreshToken);

    //clearing cookies
    return res.status(200)
    .clearCookie("accessToken", optionsforCookies)
    .clearCookie("refreshToken", optionsforCookies)
    .json(
        new ApiResponse(200,{},"User LoggedOut")
    )

})

//now we are creating an endpoint for frontend to hit thru which it can revalidate the access token by validating it with refresh token that is stored in the database and one which is has in form of cookie.
const revalidateTokens = asyncHandler(async(req,res)=>{
    
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken ;
    if(!incomingToken ){
        throw new ApiError(401, "Unauthorized request , No tokens found");
    }

    //now we have incoming tokens and we need to decode the token
    const decodedToken = jwt.verify(incomingToken , process.env.REFRESH_TOKEN_SECRET);
    
    //now this decoded token has user._id
    const [user] = await connection.query(`select * from users where user_id = ?`,[decodedToken?.userid])
    if(!user[0]){
        throw new ApiError(401, "User not found || invalid tokens");
    }

    //now we just need to recreate tokens and update in database and cookies
    const {accessToken, refreshToken} = await generateTokens(user[0]?.user_id);
    const [updatedUser] = await connection.query(`select * from users where user_id = ?`,[user[0]?.user_id])

    return res.status(200)
    .cookie("accessToken", accessToken , optionsforCookies)
    .cookie("refreshToken", refreshToken, optionsforCookies)
    .json(
        new ApiResponse(200,updatedUser[0])
    )
})

//update controllers will be added here

const getUserDetails = asyncHandler(async (req,res) =>{
    return res.status(200)
    .json(
        new ApiResponse(200, req.user,"User details found")
    )
})

const getChannelDetails = asyncHandler(async(req, res)=>{
    const user_id = req.params;
    const [result] = await connection.query(`
        select fullname , `)

})


export {registerUser,
    loginUser,
    logoutUser,
    revalidateTokens,
    getUserDetails
};