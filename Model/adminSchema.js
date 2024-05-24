const mongoose=require('mongoose')

const adminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        unique:true
    }
})

module.exports=mongoose.model("AdminSchema",adminSchema)