// src/routes/cartRoutes.js
const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
const { isUser } = require('../middleware/auth')

// 存入會員購物車資料
router.post('/cart/:userId', isUser, cartController.addToCart)

// 取得會員購物車資料
router.get('/cart/:userId', isUser, cartController.getCart)

// 更新會員購物車資料
router.put('/cart/:userId', isUser, cartController.updateCart)

// 刪除會員購物車單一品項
router.delete('/cart/:userId/:productId', isUser, cartController.deleteFromCart)

// 清空會員購物車資料
router.delete('/cart/:userId', isUser, cartController.deleteCart)

module.exports = router
