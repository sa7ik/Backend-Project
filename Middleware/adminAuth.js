const jwt=require("jsonwebtoken")

module.exports = function verifyToken(req,res,next){
    const {token,refreshToken}=req.cookies;

    if(!token){
        if(!refreshToken){
            return res.status(401).send("Login your Account")
        }
        return res.redirect("/api/admin/refresh-token")
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if (err){
            return res.status(401).json({
                success:false,
                message:"Unauthorized",
            })
        }
        req.email=decoded.email;
        next();
    })
}