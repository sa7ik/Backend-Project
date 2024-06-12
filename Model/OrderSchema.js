const mongoose=require("mongoose")

const orderSchema = new mongoose.Schema({
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"product",
                required:true,
            },
            quantity:{
                type:Number,
                default:1,
            }
        }
    ],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserSchema",
        required:true
    },
    purchaseDate:{
        type:Date,
        default:Date.now,
        immutable:true,
    },
    totalItems:{
        type:Number,
        default:0
    },
    totalPrice:{
        type:Number,
        default:0
    },
    orderId:{
        type:String
    },
});

module.exports=mongoose.model("Order",orderSchema)