const express=require('express')
const controller=require('../Controller/userForm')
const {tryCatch}=require('../Utils/tryCatch')
const userAuth=require('../Middleware/userAuth')
const userRoutes=express.Router()

userRoutes.post("/user/register",tryCatch(controller.userRegistration))
userRoutes.post("/user/Login",tryCatch(controller.userLogin))
userRoutes.get('/user/product',tryCatch(controller.viewProduct))
userRoutes.get('/user/productid/:id',tryCatch(controller.productById))
userRoutes.post('user/addcart',userAuth,tryCatch(controller.addToCart))
userRoutes.post('user/wishlist',userAuth,tryCatch(controller.addToWishList))

module.exports = userRoutes