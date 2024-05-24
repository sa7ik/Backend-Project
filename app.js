const express=require('express')
const app=express()
const mongoose=require('mongoose')
const port=3000

mongoose.connect("mongodb://localhost:27017/BabyProducts").then(res=>console.log("connected dbs")).catch(err=>console.log(err))

// app.use('/api',userRoute)

app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})