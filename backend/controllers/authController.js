const User = require('../models/User.model.js')
const jwt = require('jsonwebtoken');

const generateToken = (id,role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
}

exports.register = async (req,res)=>{
     const {name,email,password,role} = req.body;
     try {
        const userExist = await User.findOne({email});
        if (userExist) return res.status(400).json({message:"User already exists" }); 
        const user = await User.create({name,email,password,role});
        const token = generateToken(user._id ,user.role)
        res.status(201).json({
            _id,
            name,
            email,
            role,
            token
        })
     } catch (error) {
        res.status(500).json({message:error.message})
     }     
}

exports.login = async (req,res)=>{
     const {email,password} = req.body;
     try {
        const user = await User.findOne({email});
       if(!user) return res.status(400).json({message:"Invalid credentials"})
        const isMatch = await user.matchPassword(password);
        if(!isMatch) return res.status(400).json({message:"Invalid credentials"});
        const token = generateToken(user._id,user.role);
        res.status(201).json({
            id:user._id,
            name:user.name,
            role:user.role,
            token


        })
     } catch (error) {
        res.status(500).json({message:error.message});
     }
}