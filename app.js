require('dotenv').config()
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const port=3010
const cors=require("cors")
const userRoute=require('./Routes/userRoute')
const adminRoute=require('./Routes/adminRoute')
const cookieParser=require('cookie-parser')

mongoose.connect("mongodb://localhost:27017/BabyProducts").then(res=>console.log("connected dbs")).catch(err=>console.log(err))

app.use(cors({origin:"http://localhost:3000",credentials:true}))
app.use(express.json())
app.use(cookieParser())
app.use('/api',userRoute);
app.use('/api',adminRoute)

app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})