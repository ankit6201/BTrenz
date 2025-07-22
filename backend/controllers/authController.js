const User = require('../models/User.model.js')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require("nodemailer")

const generateToken = (id,role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
}

// nodemailer setup 

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user
    }
})


exports.register = async (req,res)=>{
     const {name,email,password,role} = req.body;
     try {
        console.log("Incoming Register Request:", req.body);
        const userExist = await User.findOne({email});
        if (userExist) return res.status(400).json({message:"User already exists" }); 
        const user = new User({name,email,password,role});
        await user.save();

        console.log("User Created:", user);

        const token = generateToken(user._id ,user.role)
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
     } catch (error) {
        res.status(500).json({message:error.message})
     }     
}

exports.login = async (req,res)=>{
     const {email,password} = req.body;
     try {
        const user = await User.findOne({email});
         if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({message:"Invalid Credential"})
         }
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