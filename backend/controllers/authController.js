const User = require('../models/User.model.js')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require("nodemailer")
require('dotenv').config();

const generateToken = (id,role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
}

// nodemailer setup 

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})


exports.register = async (req,res)=>{
     const {name,email,password,role} = req.body;
     try {
        const userExist = await User.findOne({email});
        if (userExist) return res.status(400).json({message:"User already exists" }); 
        const user = new User({name,email,password,role});
        await user.save();


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


// forgot the password

exports.forgotpassword = async (req,res)=>{
     const {email} = req.body;

     try {
        const user  = await User.findOne({email});
        if (!user) return res.status(404).json({message:"we are not found this user name here!"})
            const resetToken = crypto.randomBytes(20).toString('hex')
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex');
        user.resetPasswordExpire  = Date.now() + 10 * 10 * 60 * 1000 ;
        await user.save({validateBeforeSave:false})
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset/${resetToken}`;
    const message = `you requested a password reset.\n\n Reset here ${resetUrl}`

    await transporter.sendMail({
        to:user.email,
        subject:"password Reset",
        text:message
    })

    res.status(200).json({message:"Email Sent"});

     } catch (error) {
        res.status(500).json({message:error.message})
     }
}

// Reset The Password 

exports.resetPassword = async(req,res)=>{
    const hasedPassword  = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken:hasedPassword,
        resetPasswordExpire:{$gt: Date.now()}
    });

    if(!user) return res.status(404).json({message:"Invalid or expired token"})
        user.password = req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire  = undefined;
    await user.save();
    res.status(200).json({message:"password Reset Completed Successfull"})
}

// optional Send Otp insted of Link 
// write it code for only for learning

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    await user.save({ validateBeforeSave: false });

    await transporter.sendMail({
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`
    });

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};


// Otp Verificatin Code is Here...

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


