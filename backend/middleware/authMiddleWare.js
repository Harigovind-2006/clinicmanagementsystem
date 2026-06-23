const jwt = require("jsonwebtoken")

function authMiddleware(req,res,next){
    const token = req.header.authorization
    
    if(!token){
        return res.send("access denied!!")
    }
    try{
        const decoded = jwt.verify(
            token,
            process.env.JWT_TOKEN
        )
        req.user=decoded
        next()
    }
    catch(error){
      return res.send("Invalid Token!!")
    }
}

module.exports={authMiddleware}
