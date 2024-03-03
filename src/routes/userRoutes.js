// src/routes/userRoutes.js
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/users', userController.getUserData)

// 我暫時用我online mongodb data
router.get('/usersInfo', userController.getUsersInfo)

// 取得個人資料 By ID
router.get('/usersInfoById/:id', userController.getUserInfoById)

// 修改個人資料 By ID
router.put('/usersInfoById/:id', userController.updateUserInfoById)

// 捐贈個人點數 By ID
router.put('/donatePointsById/:id', userController.donatePointsById)

// 刪除所有用戶
router.delete('/users', userController.deleteAllUsers)

// 取得自己的 Id
router.get('/selfId', userController.getSelfId)

// 新增積分記錄
router.post('/addPointsRecord', userController.addPointsRecord)

// 取得本月最佳慈善捐款者
router.get('/getBestDonator', userController.getBestDonator)
module.exports = router
