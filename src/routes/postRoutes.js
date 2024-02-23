// src/routes/postRoutes.js
const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

// 取得所有貼文
router.get('/posts', postController.getAllPosts)

// 取得貼文 By ID
router.get('/posts/:id', postController.getPostById)

// 取得貼文 By User ID
router.get('/posts/user/:userId', postController.getPostByUserId)

// 新增貼文
router.post('/posts', postController.createPost)

module.exports = router
