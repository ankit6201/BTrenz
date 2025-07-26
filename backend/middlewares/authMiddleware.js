const jwt = require('jsonwebtoken');
const User = require('../models/User.model')


exports.protect = async (req,res,next) =>{
    let token;
     if (req.header.authorization && req.header.authorization.startsWith("Bearer")) {
        try {
            // Get it token from the header
           token = req.header.authorization.split(" ")[1] 
           // Verify token
           const decode = jwt.verify(token,process.env.JWT_SECRET)
           req.user = User.findOne(decode.id).select("-password");
           next()
        } catch (error) {
            res.status(401).json({message:"Not authorized, token failed"})
        }

     }

     if (!token) {
        res.status(401).json({message:"Not authorized, no Token "})
     }
}

exports.adminOnly = (req,res,next)=>{
   if (req.user && req.user.role==="admin") {
      next();
   }else{
      res.status(403).json({message:"Access denied: Admins only"})
   }
}

exports.sellerOnly = (req,res,next)=>{
   if (res.user && req.user.role ==="seller") {
      next()
   }else{
      res.status(403).json({message:"Access denied: Sellers only"})
   }
}