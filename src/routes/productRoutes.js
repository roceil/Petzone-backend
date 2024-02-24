// src/routes/postRoutes.js
const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

// 取得所有商品列表
router.get('/products', productController.getAllProducts)

// 取得商品 By ID
router.get('/products/:id', productController.getProductById)

// 新增商品
router.post('/products', productController.createProduct)

// 更改商品內容 By ID
router.put('/products/:id', productController.updateProductById)

// 刪除商品 By ID
router.delete('/products/:id', productController.deleteProductById)

// 刪除所有商品
router.delete('/products', productController.deleteAllProducts)

module.exports = router
