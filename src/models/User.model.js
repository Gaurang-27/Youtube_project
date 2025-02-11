import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

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


export const User=mongoose.model("User",userModel);