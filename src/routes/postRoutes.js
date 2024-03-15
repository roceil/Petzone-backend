// src/routes/postRoutes.js
const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const { isUser, isAdmin } = require('../middleware/auth')

// 取得所有 tags
router.get('/tags', postController.getAllTags)

// 取得所有貼文
router.get('/posts', postController.getAllPosts)

// 隨機 20 篇貼文
router.get('/posts/random', postController.getRandomPosts)

// 取得貼文 By ID
router.get('/post/:id', postController.getPostById)

// 取得所有貼文 By User ID
router.get('/posts/user/:userId', postController.getPostsByUserId)

// 新增貼文
router.post('/post', isUser, postController.createPost)

// 編輯貼文 By ID
router.put('/post/:id', isUser, postController.updatePostById)

// 刪除所有貼文
router.delete('/posts', postController.deleteAllPosts)

// 刪除貼文 By ID
router.delete('/post/:id', isUser, postController.deletePostById)

// 點讚貼文
router.post('/post/:id/like', isUser, postController.createPostLike)

// 更新貼文點讚
router.put('/post/:id/like', isUser, postController.updatePostLike)

// 留言貼文
router.post('/post/:id/comment', isUser, postController.createPostComment)

// 更新留言貼文
router.put(
  '/post/:id/comment/:commentId',
  isUser,
  postController.updatePostComment
)

// 刪除留言貼文
router.delete(
  '/post/:id/comment/:commentId',
  isUser,
  postController.deletePostComment
)

// 後台

// 取得所有貼文
router.get('/admin/posts', isAdmin, postController.getAllPostsByAdmin)

// 取得貼文 By ID
router.get('/admin/post/:id', isAdmin, postController.getPostByAdmin)

// 刪除貼文 By ID
router.delete('/admin/post/:id', isAdmin, postController.deletePostByAdmin)

// 刪除留言貼文
router.delete(
  '/admin/post/:id/comment/:commentId',
  isAdmin,
  postController.deletePostCommentByAdmin
)

module.exports = router
