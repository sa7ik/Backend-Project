const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    image:{
        type:String,
        required:true
    },
    createdAt:String,
    updatedAt:String,

},
    {
        timeStamp:true
    }
)
module.exports=mongoose.model("product",productSchema)