const productSchema=require("../Model/product")
const joi=require("joi")
const UserSchema=require("../Model/UserSchema")
const cartSchema=require("../Model/CartSchema")

// joi validation

const Schema=joi.object({
    name:joi.string().messages({
        "name.empty":"Name is required"
    }),
    price:joi.number().messages({
        "price.base":"price must be number"
    }),
    description:joi.string().messages({
        "description.base":"Description must be string",
        "description.empty":"Description cannot be empty"
    }),
    image:joi.string().messages({
        "image.base":"image url must be string"
    }),
});

// view all users

const allUsers= async(req,res)=>{
    const {token} = req.cookies;
    const users=await UserSchema.find();
    if (users.length===0){
        res.status(400).json({
            success:true,
            message:"users is empty",
        })
    }
    else{
        res.status(201).json(users);
    }
};

//view users by Id

const userById=async (req,res)=>{
    const{token}=req.cookies
    const userId=req.params.id
    const user = await UserSchema.findById(userId);
    if(!user){
        res.status(404).json({
            success:false,
            message:"User not found the specified id",
        })
    }
    else{
        res.status(201).json(user)
    }
}

// view user Cart

const getCart=async (req,res)=>{
    const {token}=req.cookies   
    const userId=req.params.id
    const Cart=await cartSchema.findOne({userId:userId})
    .populate("cart.productId");

    if(!Cart||Cart.cart.length===0){
        return res.status(404).send("Cart is empty")
    }
    return res.status(200).json(Cart)
}

// view all products

const viewProduct = async (req,res)=>{
    const {token}=req.cookies
    const product = await productSchema.find();
    if (product.length===0){
        res.status(404).send("product is empty")
    }
    else{
        res.json(product)
    }
}

// view product bt Id

const viewProductById=async (req,res)=>{
    const {token}=req.cookies
    const productId=req.params.id
    const product=await productSchema.findById(productId)

    if (!product){
        res.status(404).json({
            success:false,
            message:"product not found",
        });
    }
    else{
        res.status(200).json(product)
    }
}