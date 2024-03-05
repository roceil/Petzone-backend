// src/routes/cartRoutes.js
const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')

// 存入會員購物車資料
router.post('/cart/:userId', cartController.addToCart)

// 取得會員購物車資料
router.get('/cart/:userId', cartController.getCart)

// 更新會員購物車資料
router.put('/cart/:userId', cartController.updateCart)

// 刪除會員購物車單一品項
router.delete('/cart/:userId/:productId', cartController.deleteFromCart)

// 清空會員購物車資料
router.delete('/cart/:userId', cartController.deleteCart)

module.exports = router
