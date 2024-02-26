// src/routes/postRoutes.js
const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

// 取得所有貼文
router.get('/posts', postController.getAllPosts)

// 隨機14篇貼文
router.get('/posts/random', postController.getRandomPosts)

// 取得貼文 By ID
router.get('/posts/:id', postController.getPostById)

// 取得貼文 By User ID
router.get('/posts/user/:userId', postController.getPostByUserId)

// 新增貼文
router.post('/posts', postController.createPost)

// 編輯貼文 By ID
router.put('/posts/:id', postController.updatePostById)

// 刪除所有貼文
router.delete('/posts', postController.deleteAllPosts)

// 刪除貼文 By ID
router.delete('/posts/:id', postController.deletePostById)

module.exports = router
