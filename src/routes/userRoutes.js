// src/routes/userRoutes.js
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { isUser, isAdmin } = require('../middleware/auth')

router.get('/users', userController.getUserData)

// 我暫時用我online mongodb data
router.get('/usersInfo', userController.getUsersInfo)

// 取得自己的個人資料
router.get('/userInfo', isUser, userController.getUserInfo)

// 取得個人資料 By ID
router.get('/userInfo/:id', userController.getUserInfoById)

// 修改自己的個人資料
router.patch('/userInfo', isUser, userController.updateUserInfo)

// 捐贈個人點數
router.put('/donatePoints', isUser, userController.donatePoints)

// 刪除所有用戶
router.delete('/users', userController.deleteAllUsers)

// 新增積分記錄
router.post('/addPointsRecord', userController.addPointsRecord)

// 取得本月最佳慈善捐款者
router.get('/getBestDonator', userController.getBestDonator)

// 取得所有用戶（admin）
router.get('/allUsers', isAdmin, userController.getAllUsers)

// 取得特定用戶（admin）
router.get('/user/:id', isAdmin, userController.getUserByAdmin)

// 取得特定用戶積分詳情（admin）
router.get('/userPoints/:id', isAdmin, userController.getUserPointsByAdmin)

// 刪除特定用戶（admin）
router.delete('/user/:id', isAdmin, userController.deleteUserByAdmin)

// 更改特定用戶權限（admin）
router.patch('/user/:id', isAdmin, userController.updateUserPermissionByAdmin)

module.exports = router
