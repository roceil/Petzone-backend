// src/routes/postRoutes.js
const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

// 取得所有 tags
router.get('/tags', postController.getAllTags)

// 取得所有貼文
router.get('/posts', postController.getAllPosts)

// 隨機14篇貼文
router.get('/posts/random', postController.getRandomPosts)

// 取得貼文 By ID
router.get('/post/:id', postController.getPostById)

// 取得所有貼文 By User ID
router.get('/posts/user/:userId', postController.getPostsByUserId)

// 新增貼文
router.post('/post', postController.createPost)

// 編輯貼文 By ID
router.put('/post/:id', postController.updatePostById)

// 刪除所有貼文
router.delete('/posts', postController.deleteAllPosts)

// 刪除貼文 By ID
router.delete('/post/:id', postController.deletePostById)

// 點讚貼文
router.post('/post/:id/like', postController.createPostLike)

// 更新貼文點讚
router.put('/post/:id/like', postController.updatePostLike)

// 留言貼文
router.post('/post/:id/comment', postController.createPostComment)

// 更新留言貼文
router.put('/post/:id/comment/:commentId', postController.updatePostComment)

// 刪除留言貼文
router.delete('/post/:id/comment/:commentId', postController.deletePostComment)

module.exports = router
