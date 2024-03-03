// src/routes/postRoutes.js
const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')

// 新增訂單
router.post('/order', orderController.createOrder)

// 取得訂單 By ID
router.get('/order/:id', orderController.getOrderByOrderId)

// 取得所有訂單
router.get('/orders', orderController.getAllOrders)

// 更改訂單付款狀態
// router.patch('/orders/:id/payment', orderController.updatePaymentStatus)

module.exports = router
