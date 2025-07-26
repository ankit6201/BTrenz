const express = require("express")
const router = express.Router()
const {register,login,forgotpassword,resetPassword,sendOtp,verifyOtp} = require('../controllers/authController')

router.post('/register',register)
router.post('/login',login)
router.post('/forgot-password',forgotpassword)
router.put('/reset/:token',resetPassword)
router.post('/send-otp',sendOtp)
router.post('/verify-otp',verifyOtp)


module.exports = router;