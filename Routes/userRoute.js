const express=require('express')
const controller=require('../Controller/userForm')
const {tryCatch}=require('../Utils/tryCatch')
const userAuth=require('../Middleware/userAuth')
const userRoutes=express.Router()

userRoutes.post("/user/register",tryCatch(controller.userRegistration))
userRoutes.post("/user/Login",tryCatch(controller.userLogin))
userRoutes.get('/user/product',tryCatch(controller.viewProduct))
userRoutes.get('/user/productid/:id',tryCatch(controller.productById))
userRoutes.post('/user/addcart',userAuth,tryCatch(controller.addToCart))
userRoutes.post('/user/wishlist',userAuth,tryCatch(controller.addToWishList))
userRoutes.delete('/user/remove/:productId',userAuth,tryCatch(controller.removeProduct))
userRoutes.get('/user/viewCart',userAuth,tryCatch(controller.getCart))
userRoutes.delete('/user/removewishlist',userAuth,tryCatch(controller.removeWishList))
userRoutes.get('/user/getWishList',userAuth,tryCatch(controller.viewWishList))
userRoutes.put('/user/decrease/:productId',userAuth,tryCatch(controller.decreaseQuantity))

module.exports = userRoutes