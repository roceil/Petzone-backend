// src/routes/orderRoutes.js
const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const { isUser } = require('../middleware/auth')

// 新增訂單
router.post('/order', orderController.createOrder)

// 取得訂單 By Order ID
router.get('/order/:id', orderController.getOrderByOrderId)

// 會員取得訂單 By User ID
router.get('/order/user/:id', isUser, orderController.getOrderByUserId)

// 後台取得所有訂單
router.get('/orders', orderController.getAllOrders)

// 更改訂單付款狀態
// router.patch('/orders/:id/payment', orderController.updatePaymentStatus)

module.exports = router
