const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"]
    },
    description:{
        type:String,
        required:[true,"please enter product description"]
    },
    price:{
        type:Number,
        required:[true,"please enter product price"],
        default:0.0
    },
    stock:{
        type:Number,
        required:[true,"please enter stock"],
        default:0,
    },
    category:{
        type:String,
        required:[true,"please enter Category"]
    },
    image:[
        {
            public_id:String,
            url:String
        }
    ],
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }

})

module.exports = mongoose.model('product',productSchema)