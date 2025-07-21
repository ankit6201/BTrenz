const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add Your Name"],
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Please Add Your Email"]
    },
    password:{
        type:String,
        required:[true,"please Add Your Password"],
        minlength:6
    },
    role:{
        type:String,
        enum:["admin","seller","user"],
        default:"user"
    }
},{
    timestamps:true
})