import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { asyncHandler } from '../utils/asynHandler.js';
import { ApiError } from '../utils/ApiError.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
    
    //first take tokens from cookies 
    try {
        const token = req.cookies?.accessToken || req.header("Authorizaton")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        //now we verify the token by decoding it 
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        
        //now this decodeded token will have user_id;
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401, "Invalid Access Token");
        }
        //add this user to req.body
        req.user =user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Token invalid");
    }

})

export {authMiddleware};
