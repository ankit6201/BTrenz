const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

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

// hash password 

userSchema.pre('save',async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,12)
    next();
})

userSchema.methods.matchPassword  = async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password);
} 

module.exports = mongoose.model('User',userSchema);