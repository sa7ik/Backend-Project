const express=require('express')
const controller=require('../Controller/userForm')
const userRoutes=express.Router()

userRoutes.post("/user/register",controller.userRegistration)
userRoutes.post("/user/Login",controller.userLogin)
userRoutes.get('/user/product',controller.viewProduct)
userRoutes.get('/user/productid/:id',controller.productById)

module.exports = userRoutes