const UserSchema=require("../Model/UserSchema")

// User Registration

const userRegistration=async(req,res)=>{
    const {email,name,password}=req.body
    const validate=await userValidation.validate({email,password,name})
    if(!validate){
        res.status(400).send("Error")
    }
    if(!(name && password && email)){
        res.status(400).send("Fill all fields")
    }

    // check user is exist or not

    const userExist=await userShema.findOne({email})
    if (userExist){
        res.status(401).send("user already Exist")
    }
}

//user login

const userLogin= async(req,res)=>{
    const {email,password}=req.body;

    if(!(email,password)){
        res.status(400).send("Please fill email and password")
    }
    const userData=await userSchema.findOne({email});
    if (!userData){
        return res.status(400).json({
            success:false,
            message:"User not found",
        })
    }
    const passwordMatch=await bcrypt.compare(
        String(password),
        userData.password
    );

    if (!passwordMatch){
        return res.status(400).json({
            success:false,
            message:"incorrect password",
        })
    }
    
}