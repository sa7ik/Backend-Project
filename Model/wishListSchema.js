const mongoose=require('mongoose')

const wishList=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserSchema",
        required:true,
        unique:true,
    },
    wishList:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true,
            },
        },
    ],
});

module.exports=mongoose.model("wishListSchema",wishList)