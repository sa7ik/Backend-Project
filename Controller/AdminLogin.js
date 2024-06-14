const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const adminModel=require('../Model/adminSchema')

const AdminRegister=async (req,res)=>{
    const {email,username,password}=req.body;

    if (!(username && email && password)){
        return res.status(400).send("Fill all fields")
    }
     
    // check if user already exists

    const adminExist=await adminModel.findOne({email})
    if(adminExist){
        return res.status(401).json({message:"User already exists"})
    }
     
    // password Encryption

    const hashPassword=await bcrypt.hash(String(password),10)

    //save user

    const adminDt=await adminModel.create({
        username,
        email,
        password:hashPassword,
    })

    // generate Token

    const token=jwt.sign({id:adminDt_.id},process.env.jwt_secret,{
        expiresIn:"2h",
    })
    res.cookie("token",token)

    adminDt.password=undefined
    return res.status(200).json({
        success:true,
        message:"Account created successfully",
    })
}

// admin login

const getAdmin=async(req,res)=>{
    const {email,password}=req.body
    const admin=await adminModel.findOne({email})

    if(!admin){
        return res.status(404).send("Admin not Found")
    }

    const passwordMatch=await bcrypt.compare(password, admin.password)

        if (!passwordMatch){
            return res.status(404).send("Incorrect password")
        }
    
        const token=jwt.sign({email:admin.email},
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:"1h",
            }
        );
        const refreshToken=jwt.sign({email:admin.email},
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn:"12h"
            }
        );
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            // sameSite:None,
        })
        res.cookie("refreshToken",refreshToken);
        return res.status(200).json({
            admin:admin,
            token:token,
            refreshToken:refreshToken,
            message:"Login successfully completed",
        });
};

// refresh Token

const generateToken = async(req,res)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).send("Login Your account")
    }
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err,decoded)=>{
        if(err){
            return res.status(401).send("Invalid refresh token");
        }
        const token=jwt.sign(
            {email:decoded.email},
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:"1h"
            }
        )
        return res.cookie("token",token,{
            expires:new Date (Date.now()+ 60 * 60 * 1000),
        })
        .send("Refresh Token Generated")
    })
}

module.exports={getAdmin,generateToken,AdminRegister}