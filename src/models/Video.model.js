import mongoose, { mongo, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoModel = new Schema({
    videofile : {
        type : String, 
        required : true,
    },
    thumbnail :{
        type : String, 
        required : true,
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    title :{
        type : String, 
        required : true,
    },
    isPublished : {
        type : Boolean,
        default : false,
    },
    duration : {
        type : Number,
        required : true
    }
},{timestamps : true})

videoModel.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoModel)