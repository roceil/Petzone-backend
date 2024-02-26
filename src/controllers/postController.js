const Post = require('../models/post-model')
const { checkUserId, checkObjectId } = require('../lib')

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    if (!posts.length) {
      return res.status(204).json({ message: '尚無貼文' })
    }

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
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

const getRandomPosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([{ $sample: { size: 14 } }])
    if (!posts.length) {
      return res.status(202).json({ message: '尚無貼文' })
    }

    res.json({
      status: 'success',
      totalPosts: posts.length,
      posts,
    })
  } catch (error) {
    console.log(error)
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
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const createPost = async (req, res) => {
  try {
    const { userId, tags, photos, content } = req.body

    // 檢查 userId 是否有存在於資料庫
    if (!(await checkUserId(userId))) {
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
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const deleteAllPosts = async (req, res) => {
  try {
    await Post.deleteMany()
    res.json({ message: '刪除所有貼文成功' })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const deletePostById = async (req, res) => {
  const { id } = req.params
  // 檢查 id 是否是一個有效的 MongoDB ObjectId
  if (!checkObjectId(id)) {
    return res.status(400).json({ message: '無效的ID格式' })
  }
  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }

    await post.deleteOne()
    res.json({ message: '刪除貼文成功' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const updatePostById = async (req, res) => {
  const { id } = req.params

  // 檢查 id 是否是一個有效的 MongoDB ObjectId
  if (!checkObjectId(id)) {
    return res.status(400).json({ message: '無效的ID格式' })
  }

  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }

    const { tags, photos, content } = req.body
    post.tags = tags || post.tags
    post.photos = photos || post.photos
    post.content = content || post.content
    await post.save()
    res.json(post)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  getRandomPosts,
  getPostByUserId,
  deleteAllPosts,
  createPost,
  updatePostById,
  deletePostById,
}
