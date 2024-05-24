const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
    name:String,
    profilePic:String,
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
});

module.exports = mongoose.model("UserSchema",userSchema);