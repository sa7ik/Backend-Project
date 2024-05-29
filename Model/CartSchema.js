const mongoose=require('mongoose');

const cartSchema=new mongoose.Schema({
    cart:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true
            },
            quantity:{
                type:Number,
                default:1,
            },
        },
    ],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true   
    },
});

mongoose.exports=mongoose.model('CartSchema',cartSchema)