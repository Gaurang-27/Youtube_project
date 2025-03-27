import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localfilePath) => {
    try {
        if(!localfilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(localfilePath, {
               resource_type: 'auto',
        })
        //file uploaded succesfully 
        //now we need to remove the file from our local storage
        fs.unlinkSync(localfilePath);
        return uploadResult;

    } catch (error) {
        fs.unlinkSync(localfilePath);
        return null;
    }
}

const deleteFromCloudinary = async(public_id,file_type)=>{
    try {
        const result = await cloudinary.uploader.destroy(public_id, { resource_type: file_type });
        //console.log('Delete Response:', result);
        return result;
      } catch (error) {
         return null;
      }
}

export {uploadOnCloudinary,deleteFromCloudinary} ;