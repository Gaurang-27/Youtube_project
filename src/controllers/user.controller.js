import { asyncHandler } from "../utils/asynHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import jwt from "jsonwebtoken"

const generateTokens = async (userid)=>{
    try {
        //finding the user using the userid and then generating tokens
        const user = await User.findById(userid);
        const accessToken = user.createAccessToken();
        const refreshToken = user.createRefreshToken();
        //console.log(accessToken, refreshToken);
        
        //updating the refreshtoken into the database
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}

const optionsforCookies = {
    httpOnly: true,
    secure: false//false for local host only
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
    
    //finding if user already exists
    const findUser = await User.findOne({
        $or : [{username}, {email}]
    })
    if(findUser){
        throw new ApiError(409 , "User already registered")
    }
    
    //checking if avatar is recieved in input
    const avatarPath = req.files?.avatar?.[0]?.path;
    console.log(avatarPath);
    if(!avatarPath){
        throw new ApiError(400, "avatar is required");
    }

    //uploading avatar on cloudinary and checking if it is uploaded correctly
    const uploadAvatar = await uploadOnCloudinary(avatarPath);
    if(!uploadAvatar){
        throw new ApiError(400, "problem in uploading avatar");
    }
    
    //finally creating a user and pushing it into the database
    const user = await User.create({
        email,
        fullName,
        password,
        avatar : uploadAvatar.url,
        username
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!createdUser){
        throw new ApiError(500, "could not register user due to some problem");
    }

    return res.status(200).json(
        new ApiResponse(201, createdUser, "User registered succesfully")
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
    const userFind= await User.findOne({email});
    if(!userFind){
        throw new ApiError(404,"user not found")
    }

    //validating password upon finding the user
    const validatePassword = await userFind.isPasswordCorrect(password)
    if(!validatePassword){
        throw new ApiError(401, "invalid credentials")
    }

    //time to generate tokens after validating password
    const {accessToken, refreshToken} =await  generateTokens(userFind._id);

    //not getting the update user object as old (userFind) still doesnot have refreshtoken
    const loggedinUser = await User.findById(userFind._id).select("-password -refreshToken");

    //now just send user data back to response
    return res.status(200)
    .cookie("accessToken", accessToken , optionsforCookies)
    .cookie("refreshToken" , refreshToken , optionsforCookies)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedinUser , accessToken , refreshToken
            },
            "Login successful"
        )
    )


})

const logoutUser = asyncHandler(async(req,res)=>{
    //due to the middleware invoked now we will have req.user which has id
    const userid = req.user._id;
    const userFind = await User.findByIdAndUpdate(
        userid,
        {
            $unset: { refreshToken: "" }
        },
        {new : true}//returns updated values
    )
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
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(401, "User not found || invalid tokens");
    }

    //now we just need to recreate tokens and update in database and cookies
    const {accessToken, refreshToken} = await generateTokens(user?._id);

    return res.status(200)
    .cookie("accessToken", accessToken , optionsforCookies)
    .cookie("refreshToken", refreshToken, optionsforCookies)
    .json(
        new ApiResponse(200,{user})
    )
})

export {registerUser,
    loginUser,
    logoutUser,
    revalidateTokens
};