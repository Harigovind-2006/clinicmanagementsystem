const jwt = require("jsonwebtoken")
const dotenv=require("dotenv")
const authMiddleWare= (req,res,next)=>{
   try{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json(
            {
                message:"User not found"
            }
        )
   }
   const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

req.user = decoded;
next();

}
catch(error){
    console.error("Authentication error:", error);
  res.status(403).json({ message: "Authentication failed" });
    
}
}
module.exports = authMiddleWare;