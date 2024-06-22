const cloudinary = require("cloudinary")
const multer = require("multer")
require('dotenv').config()
const path=require("path")
const fs=require("fs")

//Configure Cloudinary

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

// Multer storage configuration

const storage = multer.diskStorage({})

// Multer upload Configuration

const upload=multer ({storage:storage});

// Middleware to upload image to Cloudinary or use provided URL

const uploadImage = (req,res,next)=>{
    upload.single("image")(req,res,async(error)=>{
        try{
            if (req.file){
                const result = await cloudinary.uploader.upload(req.file.path);
                req.cloudinaryImageUrl=result.secure_url;
                fs.unlinkSync(req.file.path)
            }
            else if (req.body.imageURL){
                req.cloudinaryImageUrl=req.body.imageURL
            }
            next();
        } catch (error){
            console.error(error);
            next(error)
        }
    })
}
module.exports={cloudinary,uploadImage}