import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userModel=new Schema({
    username:{
        type: String,
        required : true,
        unique : true,
        trim : true,
        index : true
    },
    email : {
        type: String,
        required : true,
        unique : true,
        trim : true
    },
    fullName: {
        type: String,
        required : true,
        trim : true
    },
    avatar: {
        type : String,
        require : true,
    },
    password:{
        type : String, 
        require : [true, "Password required"],
        trim : true
    },
    refreshToken :{
        type: String,
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ]
},{timestamps : true})

userModel.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userModel.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userModel.methods.createAccessToken = function(){
    return jwt.sign({
        _id: this._id
      }, 
      process.env.ACCESS_TOKEN_SECRET, 
      {expiresIn : process.env.ACCESS_TOKEN_EXP});
}

userModel.methods.createRefreshToken = function(){
    return jwt.sign({
        _id: this._id
      }, 
      process.env.REFRESH_TOKEN_SECRET, 
      {expiresIn : process.env.REFRESH_TOKEN_EXP});
}

export const User=mongoose.model("User",userModel);