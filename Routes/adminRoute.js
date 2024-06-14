const express=require("express")
const Controller=require("../Controller/AdminLogin")
const adminController=require("../Controller/adminForm")
const adminRoutes=express.Router()
const {tryCatch}=require("../Utils/tryCatch")
const adminAuth=require("../Middleware/adminAuth")

adminRoutes.post("/admin/register", tryCatch(Controller.AdminRegister))
adminRoutes.post("/admin/login",tryCatch(Controller.getAdmin))
adminRoutes.get("/admin/allusers",adminAuth,tryCatch(adminController.allUsers))
adminRoutes.get("/admin/user/:id",adminAuth,tryCatch(adminController.userById))
adminRoutes.get("/admin/allproduct",adminAuth,tryCatch(adminController.viewProduct))
adminRoutes.get("/admin/productid/:id",adminAuth,tryCatch(adminController.viewProductById))
adminRoutes.delete("/admin/delete/:id",adminAuth,tryCatch(adminController.deleteProduct))
adminRoutes.get("/admin/cart/:id",adminAuth,tryCatch(adminController.getCart))
adminRoutes.get("/admin/orders",adminAuth,tryCatch(adminController.orders))
adminRoutes.get("/admin/ordersid/:userId",adminAuth,tryCatch(adminController.ordersById))

module.exports=adminRoutes