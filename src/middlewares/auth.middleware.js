import jwt, { decode } from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { asyncHandler } from '../utils/asynHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {connection } from '../index.js'

const authMiddleware = asyncHandler(async (req, res, next) => {
    
    //first take tokens from cookies 
    try {
        const token = req.cookies?.accessToken || req.header("Authorizaton")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
        //console.log(token)
    
        //now we verify the token by decoding it 
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        
        //now this decodeded token will have user_id;
        const [user] = await connection.query(`
            select * from users where user_id = ?`, [decodedToken?.userid])
        if(!user[0]){
            throw new ApiError(401, "Invalid Access Token");
        }
        delete user[0].password_hash
        delete user[0].refreshToken
        //add this user to req.body
        req.user =user[0];
        //console.log("done authmiddleware")
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Token invalid");
    }

})

export {authMiddleware};
