const express=require('express')
const app=express()
const mongoose=require('mongoose')
const port=3000
const userRoute=require('./Routes/userRoute')

mongoose.connect("mongodb://localhost:27017/BabyProducts").then(res=>console.log("connected dbs")).catch(err=>console.log(err))

app.use(express.json())
app.use('/api',userRoute);

app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})

// const express = require('express');
// const mongoose = require('mongoose');
// const userRoute = require('./Routes/userRoute');

// const app = express();
// const port = 3000;

// mongoose.connect("mongodb://localhost:27017/BabyProducts")
//     .then(() => {
//         console.log("Connected to MongoDB");
//         app.listen(port, () => {
//             console.log(`App listening on port ${port}`);
//         });
//     })
//     .catch(err => {
//         console.error("Error connecting to MongoDB:", err);
//         process.exit(1); // Exit the process if unable to connect to MongoDB
//     });

// app.use('/api', userRoute);

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });
