const UserSchema = require("../Model/UserSchema")
const productSchema=require("../Model/product")
const cartSchema=require('../Model/CartSchema')
const wishListSchema=require('../Model/wishListSchema')
const joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const OrderSchema = require("../Model/OrderSchema")

//joi validation

const userValidation = joi.object({
    name: joi.string().required().messages({
        "string.base": "Name is Required",
    }),
    email: joi.string().email().messages({
        "string.base": "Email is Required",
        "string.pattern.base": "Email must be in format",
    }),
    password: joi.string().messages({
        "string.base": "Password is Required",
    }),
})

// User Registration

const userRegistration = async (req, res) => {
    const { name, email, password } = req.body
    console.log(req.body);
    const validate = await userValidation.validate({ name, email, password })

    if (!validate) {
        res.status(400).send("Error")
    }
    if (!(name && password && email)) {
        res.status(400).send("Fill all fields")
    }

    // check user is exist or not

    const userExist = await UserSchema.findOne({ email })
    if (userExist) {
        res.status(401).send("user already Exist")
    }

//password bcrypt

const hashpassword=await bcrypt.hash(String(password),10)

    const user = await UserSchema.create({
        name,
        email,
        password: hashpassword,
    })

     const token = jwt.sign({ id: user._id },process.env.jwt_secret, {
        expiresIn: "2h",
      });
    // user.token = token;
      res.cookie("token", token);

    user.password = undefined;
    res.status(200).json({
        success: true,
        message: "Account created successfully",
    });
}

//user login

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!(email, password)) {
        res.status(400).send("Please fill email and password")
    }
    const userData = await UserSchema.findOne({ email });
    if (!userData) {
        return res.status(400).json({
            success: false,
            message: "User not found",
        })
    }
    const passwordMatch =await bcrypt.compare(
        String(password),
        userData.password,
    )

    console.log(passwordMatch)

    if (!passwordMatch) {
        return res.status(400).json({
            success: false,
            message: "incorrect password",

        })
    }

    const token = jwt.sign({ id: userData._id }, process.env.jwt_secret, {
        expiresIn: "2h",
    })

    res.cookie("token", token);
    res.status(200).json({
        userData: userData,
        message: "Login Successful"
    })

}
//view product

const viewProduct=async(req,res)=>{
const product = await productSchema.find();
if (product.length===0){
    res.status(400).json({
        success:false,
        message:"product is empty"
    })
}else{
    res.status(200).json(product);
}
}

//view product by Id

const productById=async(req,res)=>{
    const productId=req.params.id;
    const product=await productSchema.findById(productId)
    if(!product){
        res.status(401).json({
            success:false,
            message:"product not found",
        })
    }
    res.status(200).json(product);
}

// add to cart

const addToCart=async (req,res)=>{
    
   const {token}=req.cookies
//    console.log(token);
    const {productId}=req.body

    const userId=req.user
    // console.log(userId);
    let user=await cartSchema.findOne({userId})

    if(!user){
        user=new cartSchema({
            userId,
            cart:[{productId:productId}],
        })
    }else{
        const itemIndex=user.cart.findIndex(
            (item)=>item.productId==productId
        )
        console.log(itemIndex);
        if(itemIndex!== -1){
         user.cart[itemIndex].quantity +=1;   
        }else{
            user.cart.push({productId})
        }
    }
    await user.save()
    res.status(200).json({
        success:true,
        message:"product added to cart",
    })
}

//view Cart

const getCart = async (req,res)=>{
    const {token}=req.cookies;
    const valid = await jwt.verify(token,process.env.jwt_secret);

    const userId = valid.id;

    const user = await cartSchema.findOne({userId:userId})
    .populate('cart.productId');
    
    if(!user||user.cart.length===0){
        res.status(404).json({
            success:false,
            message:'cart is empty',
        })
    }
    res.status(200).json(user);
}

//decrease product quantity

const decreaseQuantity=async(req,res)=>{
    const {token}=req.cookies
    const valid=jwt.verify(token,process.env.jwt_secret);
    const {productId}=req.params;
    const userId=valid.id;

    const user=await cartSchema.findOne({userId:userId});

    if(!user){
        res.status(404).send('Product not found in your cart')
    }
    const itemIndex=user.cart.findIndex((item)=>item.productId==productId);

    if (itemIndex !== -1){
        user.cart[itemIndex].quantity -= 1
    }
    await user.save();
    res.status(200).send('Product quantity decreased')
}

//delete from cart

const removeProduct = async(req,res)=>{
    const {token} = req.cookies;
    const valid = jwt.verify(token,process.env.jwt_secret)
    const {productId} = req.params;

    const userId=valid.id

    const user = await cartSchema.findOne({userId:userId})

    if(!user){
        res.status(404).send('No product found in your cart')
    }
    const itemIndex = user.cart.findIndex((item) => item.productId==productId)

    if (itemIndex !== -1){
        user.cart.splice(itemIndex, 1)

        await user.save();
        res.status(200).send('product removed from cart')
    }
}

//Add product to wishList

const addToWishList=async(req,res)=>{
    const {token}=req.cookies;
    const {productId,userId}=req.body;
    let addwishList=await wishListSchema.findOne({userId}).populate("wishlist.productId")
    if(!addwishList){
        addwishList=new wishListSchema({
            userId,
            wishList:[{productId:productId}],
        });
        await addwishList.save();
        res.send("product added to your wishList")
    }
    const itemIndex=addwishList.wishlist.findIndex(
        (item)=>item.productId==productId
    );
    console.log(itemIndex);
    if(itemIndex === -1){
        addwishList.wishlist.push({productId});
        await addwishList.save();
        res.send("product added to your wishList")
    }
    console.log(itemIndex);
    res.send("product already exist in wishList");

    res.status(200).json({
        success:true,
        message:"product added to wishlist"
    })
}

//read wishList
const viewWishList = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await wishListSchema.findOne({ userId: userId })
            .populate('wishlist.productId');
            if (!user || user.wishlist.length === 0) {
                return res.status(400).send('No products found in your WishList');
            }
            
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}


//remove WishList

const removeWishList = async(req,res)=>{
    const {token} = req.cookies;
    const {userId,productId}=req.body;

    const wishList=await wishListSchema.findOne({userId});
    // console.log(wishList);
    if (!wishList){
        res.status(404).json({
            success:false,
            message:'No item found in your wishList'
        })
    }
    const itemIndex = wishList.wishlist.findIndex(
        (item)=>item.productId==productId
    );
    console.log(itemIndex);
    if (itemIndex === -1){

        res.send('Item not found in your WishList')
    }
    wishList.wishlist.splice(itemIndex, 1);
    await wishList.save();
    res.send("item Removed")
}

// const order=async(req,res)=>{
//     try{
//         const {token}=req.cookies
//         const valid=jwt.verify(token,process.env.jwt_secret);
//         const userId=valid.id;
//         const cartData=await cartSchema.findOne({userId:userId});

//         if(!cartData ||cartData.cart.length===0){
//             return res.status(200).send('No product found in your cart')
//         }

//         const line_items=[];
//         for (const cartItem of cartData.cart){
//             const product = await productSchema.findById(cartItem.productId);
//             if (!product){
//                 res.status(404).send(`product with ID ${cartItem.productId} not found`)
//             }
//             line_items.push({
//                 price_data:{
//                     currency:'inr',
//                     product_Data:{
//                         name:product.name,
//                     },
//                     unit_amount=Math.round(product.price*100),
//                 },
//                 quantity:cartItem.quantity,
//             })
//         }
//     }
// }

//Buy Cart items

const orderSuccess=async (req,res)=>{
    const {session,token}=req.cookies;

    const valid=jwt.verify(token,process.env.jwt_secret);
    const userId=valid.id

    res.clearCookie("session");

    const Cart=await cartSchema.findOne({userId}).populate({
        path:"cart.productId",
        model:"product",
    })

    if (!cart||Cart.cart.length===0){
        return res.status(200).send("No products found in your cart")
    }
    let totalItems=0;
    let totalPrice=0;

    Cart.cart.forEach((item)=>{
        const quantity=item.quantity||0;
        const price=item.productId.price||0;

        totalItems += quantity;
        totalPrice += quantity*price;
    })
    
    // create new order
    
    const order=new OrderSchema({
        userId: Cart.userId,
        totalItems,
        totalPrice,
        orderId:`ORD ${session}`,
    });

    Cart.cart.forEach((item)=>{
        order.products.push({
            productId: items.productId._id,
            quantity:items.quantity
        })
    })
        await order.save();

        Cart.cart=[];
        await Cart.save();

        res.status(200).send("order placed successfully")
}
//order records

const orderRecords=async (req,res)=>{
    const {token}=req.cookies
    const {userId}=req.params

    const orders=await OrderSchema.findOne({userId});

    if (!orders){
        res.status(404).send("No order Records");
    }
    res.status(200).json(orders)
}

module.exports = {
    userRegistration,
    userLogin,
    viewProduct,
    productById,
    addToCart,
    addToWishList,
    removeProduct,
    getCart,
    removeWishList,
    viewWishList,
    decreaseQuantity,
    orderSuccess,
    orderRecords
}