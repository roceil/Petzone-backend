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

module.exports = router
