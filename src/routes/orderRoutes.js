// src/routes/orderRoutes.js
const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const { isUser, isAdmin } = require('../middleware/auth')

// 新增訂單
router.post('/order', orderController.createOrder)

// 前台、後台取得訂單 By Order ID
router.get('/order/:id', orderController.getOrderByOrderId)

// 會員取得訂單 By User ID
router.get('/order/user/:id', isUser, orderController.getOrderByUserId)

// 後台取得所有訂單
router.get('/orders', isAdmin, orderController.getAllOrders)

// 後台修改訂單資料
router.put('/order/:id', isAdmin, orderController.UpdateOrder)

// 後台修改訂單狀態
router.put('/order/:id/status', isAdmin, orderController.UpdateOrderStatus)

module.exports = router
