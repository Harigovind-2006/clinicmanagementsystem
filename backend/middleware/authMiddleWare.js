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

}
catch{
    
}
}