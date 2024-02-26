// src/routes/postRoutes.js
const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')

// 取得所有訂單
router.get('/orders', orderController.getAllOrders)

// 取得訂單 By ID
router.get('/orders/:id', orderController.getOrderByOrderId)

// 新增訂單
router.post('/orders', orderController.createOrder)

// 更改訂單付款狀態
router.patch('/orders/:id/payment', orderController.updatePaymentStatus)

module.exports = router
