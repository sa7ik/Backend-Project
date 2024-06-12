const productSchema=require("../Model/product")
const joi=require("joi")
const UserSchema=require("../Model/UserSchema")
const cartSchema=require("../Model/CartSchema")
const OrderSchema=require("../Model/OrderSchema")

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

// add product

const addProduct=async(req,res)=>{
    const {token}=req.cookies
    const data=req.body
    data.image=req.cloudinaryImageUrl

    const {name,description,price,image}=data;

    const validate = await Schema.validate(data)
    if(!validate){
        return res.status(400).send("product not validated")
    }
    const existingProduct=await productSchema.findOne({name:name})
    if (existingProduct){
        return res.status(400).json({
            success:false,
            message:"product with same name already exists",
        })
    }
    const newProduct=new productSchema({
        name,
        description,
        price,
        image,
    })
    await newProduct.save();
    res.status(200).send("Product added successfully")
}

// update product

const updateProduct=async (req,res)=>{
    const {token}=req.cookies
    const {id}=req.params

    const data=req.body;

    const {name,description,price,image}=data
    const {error}=Schema.validate(data);
    if (error){
        res.status(400).send({message:error.details[0].message})
    }
    const product=await productSchema.findById(id);

    if (!product){
        return res.status(404).json({success:false,message:"Product not found"})
    }
    product.image = req.cloudinaryImageUrl

    await productSchema.findByIdAndUpdate(
        {_id:id},
        {
            name:name,
            image:req.cloudinaryImageUrl,
            price:price,
            description:description,
        }
    )
    res.status(201).json({
        success:true,
        message:"Product updated"
    })
}

// delete product

const deleteProduct=async(req,res)=>{
    const {token}=req.cookies
    const {id}=req.params

    const deleted=await productSchema.findByIdAndDelete(id)
    if(!deleted){
        return res.status(404).json({
            success:false,
            message:"Product not found",
        })
    }
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
}

// order details

const orders = async (req,res)=>{
    const {token}=req.cookies

    const products=await OrderSchema.find().populate("products.productId")

    if (products.length===0){
        res.status(404).json({
            success:false,
            messages:"No orders found"
        })
    }
    res.status(200).json(products)
}

//separate order

const ordersById=async (req,res)=>{
    const {token}=req.cookies
    const {id}=req.params

    const products=await OrderSchema.findOne({userId:userId}).populate("products.productId")

    if (products.length===0){
        res.status(404).json({
            success:false,
            message:"No orders found"
        })
    }
    res.status(200).json(products)
}