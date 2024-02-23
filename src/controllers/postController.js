const Post = require('../models/post-model')
const User = require('../models/user-model')

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    if (!posts.length) {
      return res.status(204).json({ message: '尚無貼文' })
    }

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    console.log('post', post)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }

    res.json(post)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const getPostByUserId = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
    if (!posts.length) {
      return res.status(204).json({ message: '尚無貼文' })
    }

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const createPost = async (req, res) => {
  try {
    const { userId, tags, photos, content } = req.body

    // 檢查 userId 是否有存在於資料庫
    if (!(await checkUserId(userId))) {
      console.log(checkUserId(userId))
      return res.status(400).json({ message: 'userId 不存在' })
    }

    const newPost = new Post({
      userId,
      tags,
      photos,
      content,
    })
    await newPost.save()
    res.json(newPost)
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const checkUserId = async userId => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      return false
    }
    return true
  } catch (error) {
    return false
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  getPostByUserId,
  createPost,
}
