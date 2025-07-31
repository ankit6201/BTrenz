const express = require('express')
const router  = express.Router()
const {createProducts,getProducts,getProduct,updateProduct,deleteProduct} = require('../controllers/productController.js')

const {protect,adminOnly,sellerOnly} = require('../middlewares/authMiddleware.js')

router.get('/',getProducts)
router.get('/:id',getProduct)

router.post('/',protect,sellerOnly,createProducts)
router.put('/:id',protect,updateProduct)
router.delete('/:id',protect,deleteProduct)

module.exports = router;