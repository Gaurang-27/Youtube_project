import { asyncHandler } from "../utils/asynHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

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
    const avatarPath = req.files?.avatar[0].path;
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
        "-password"
    );
    if(!createdUser){
        throw new ApiError(500, "could not register user due to some problem");
    }

    return res.status(200).json(
        new ApiResponse(201, createdUser, "User registered succesfully")
    );



})

export {registerUser};