const mongoose=require('mongoose')

const wishlist=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserSchema",
        required:true,
        unique:true,
    },
    wishlist:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true,
            },
        },
    ],
});

module.exports=mongoose.model("wishListSchema",wishlist)