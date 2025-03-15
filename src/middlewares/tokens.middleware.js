import jwt from "jsonwebtoken";

const createAccessToken = function(userid){
    return jwt.sign({
        userid : userid
      }, 
      process.env.ACCESS_TOKEN_SECRET, 
      {expiresIn : process.env.ACCESS_TOKEN_EXP});
}

const createRefreshToken = function(userid){
    return jwt.sign({
        userid : userid
      }, 
      process.env.REFRESH_TOKEN_SECRET, 
      {expiresIn : process.env.REFRESH_TOKEN_EXP});
}

export {createAccessToken, createRefreshToken}