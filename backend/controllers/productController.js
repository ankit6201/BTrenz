const Product = require('../models/Product.model')


exports.createProducts = async(req,res)=>{
    try {
        const {name,description,price,stock,category} = req.body;
          const product = new Product({
                name,
                description,
                price,
                stock,
                category,
                seller:req.user._id
            
         })
         await product.save()
         res.status(201).json(product)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// @desc  Get all the Products 

exports.getProducts = async(req,res)=>{
    try {
        const products = await Product.find().populate('seller','name email')
        res.json(products)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// @desc get one product 

exports.getProduct = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id).populate("seller","name email");
        if (!product) return res.status(404).json({message:"product not found"})
            res.json(product)
        
    } catch (error) {
         res.status(500).json({message:error.message})
    }
}

// @desc  update product 

exports.updateProduct = async(req,res)=>{
    try {
        const {name,description,price,stock,category} = req.body;

        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({message:"product not found"})
            // only seller and admin can be update 
            if (product.seller.toString()!== req.user._id.toString() && req.user.role !=="admin") {
                return res.status(404).json({message:"not authorized"})
            }

            product.name = name || product.name;
            product.description = description || product.description
            product.price = price || product.price;
            product.stock = stock ||  product.stock;
            product.category = category || product.category;
            await product.save()
            res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// desc delete product 

exports.deleteProduct = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
         if(!product) return res.status(404).json({message:"product not found"});
         if (product.seller.toString() !== req.user._id.toString() && req.user.role !=='admin') {
           return res.status(403).json({message:"user not authorized"});
         }
         await product.remove()
         res.json({message:"product removed"})
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}


// {
//     "name":"jeans",
//     "description":"This is A verity of bhutan",
//      "price":1000,
//      "stock": 5,
//       "category":"V2"
// }