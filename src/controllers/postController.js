const mongoose = require('mongoose')

const Post = require('../models/post-model')
const User = require('../models/user-model')
const { tags } = require('../lib/enum')
const { updatePoints } = require('../lib/index')

const getAllTags = async (req, res) => {
  res.json(tags)
}

const getAllPosts = async (req, res) => {
  try {
    const { nickName, tag } = req.query
    let searchNickName = {}
    if (nickName) {
      const users = await User.find({
        nickName: { $regex: nickName, $options: 'i' },
      })
      const userIds = users.map((user) => user._id)
      searchNickName = { user: { $in: userIds } }
    }
    let searchTag = {}
    if (tag) {
      searchTag = { tags: { $in: tag } }
    }
    const search = {
      ...searchNickName,
      ...searchTag,
    }
    const posts = await Post.find(search).sort({ createdAt: -1 })
    const returnPosts = posts.map((post) => {
      return {
        _id: post._id,
        photo: post.photos[0],
        likesLength: post.likes.length,
        commentsLength: post.comments.length,
      }
    })

    res.json(returnPosts)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'nickName photo',
      })
      .populate({
        path: 'comments.user',
        select: '_id nickName photo',
      })
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }

    res.json(post)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const getPostsByUserId = async (req, res) => {
  try {
    const user = new mongoose.Types.ObjectId(`${req.params.userId}`)
    const posts = await Post.find({ user }).sort({ createdAt: -1 })
    const returnPosts = posts.map((post) => {
      return {
        _id: post._id,
        photo: post.photos[0],
        likesLength: post.likes.length,
        commentsLength: post.comments.length,
      }
    })
    res.json(returnPosts)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const createPost = async (req, res) => {
  try {
    const { userId } = req
    const { tags, photos, content } = req.body

    if (!photos.length || photos.length > 3) {
      res.status(400).json({ message: 'photos 數量需介於 1~3' })
    }
    if (content.length > 255) {
      res.status(400).json({ message: 'content 最大長度為 255' })
    }

    const newPost = new Post({
      user: userId,
      tags,
      photos,
      content,
    })
    await newPost.save()

    // 更新積分
    const user = await User.findById(userId)
    updatePoints(user, 1, 5)

    res.json({ message: '新增貼文成功' })
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
  const { userId } = req
  const { id } = req.params
  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    if (userId !== `${post.user}`) {
      return res.status(400).json({ message: '只可刪除自己的貼文' })
    }

    await post.deleteOne()
    res.json({ message: '刪除貼文成功' })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const updatePostById = async (req, res) => {
  const { userId } = req
  const { id } = req.params
  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    if (userId !== `${post.user}`) {
      return res.status(400).json({ message: '只可更新自己的貼文' })
    }

    const { tags, photos, content } = req.body

    if (content.length > 255) {
      res.status(400).json({ message: 'content 最大長度為 255' })
    }

    post.tags = tags || post.tags
    post.photos = photos || post.photos
    post.content = content || post.content
    await post.save()
    res.json({ message: '更新貼文成功' })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const createPostLike = async (req, res) => {
  const { userId } = req
  const { id } = req.params
  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    if (post.likes.find((item) => `${item.user}` === userId)) {
      return res.status(400).json({ message: '已加入 likes 請用 put 更新' })
    }
    post.likes.push({
      user: userId,
      isLiked: true,
    })
    await post.save()

    // 更新積分
    const user = await User.findById(userId)
    updatePoints(user, 2, 1)

    res.json({ message: '點讚成功' })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const updatePostLike = async (req, res) => {
  const { userId } = req
  const { id } = req.params
  try {
    const { isLiked } = req.body
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    let index = post.likes.findIndex((item) => `${item.user}` === userId)
    if (index === -1) {
      return res.status(400).json({ message: '尚未加入 likes 請用 post 新增' })
    }
    post.likes[index] = {
      user: userId,
      isLiked,
    }
    await post.save()
    res.json({ message: '更新點讚成功' })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const createPostComment = async (req, res) => {
  const { userId } = req
  const { id } = req.params
  try {
    const { content } = req.body
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    if (!content) {
      res.status(400).json({ message: 'content 必填' })
    }
    post.comments.push({
      _id: new mongoose.Types.ObjectId(),
      user: userId,
      content,
      createAt: new Date(),
      updateAt: new Date(),
    })
    await post.save()

    // 更新積分
    const user = await User.findById(userId)
    updatePoints(user, 3, 1)

    res.json({ message: '新增留言成功' })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const updatePostComment = async (req, res) => {
  const { userId } = req
  const { id, commentId } = req.params
  try {
    const { content } = req.body
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    const index = post.comments.findIndex((item) => `${item._id}` === commentId)
    if (index === -1) {
      return res.status(400).json({ message: '沒有匹配的留言ID' })
    }
    if (userId !== `${post.comments[index].user}`) {
      return res.status(400).json({ message: '只可更新自己的留言' })
    }
    if (!content) {
      res.status(400).json({ message: 'content 必填' })
    }
    post.comments[index] = {
      _id: post.comments[index]._id,
      user: post.comments[index].user,
      content,
      createAt: post.comments[index].createAt,
      updateAt: new Date(),
    }
    await post.save()
    res.json({ message: '更新留言成功' })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const deletePostComment = async (req, res) => {
  const { userId } = req
  const { id, commentId } = req.params
  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    const index = post.comments.findIndex((item) => `${item._id}` === commentId)
    if (index === -1) {
      return res.status(400).json({ message: '沒有匹配的留言ID' })
    }
    if (userId !== `${post.comments[index].user}`) {
      return res.status(400).json({ message: '只可刪除自己的留言' })
    }
    post.comments.splice(index, 1)
    await post.save()
    res.json({ message: '刪除留言成功' })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const getRandomPosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([{ $sample: { size: 16 } }])
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const getAllPostsByAdmin = async (req, res) => {
  try {
    const { nickName, tag, page } = req.query
    let searchNickName = {}
    if (nickName) {
      const users = await User.find({
        nickName: { $regex: nickName, $options: 'i' },
      })
      const userIds = users.map((user) => user._id)
      searchNickName = { user: { $in: userIds } }
    }
    let searchTag = {}
    if (tag) {
      searchTag = { tags: { $in: tag } }
    }
    const search = {
      ...searchNickName,
      ...searchTag,
    }
    const pagination = Math.ceil((await Post.countDocuments(search)) / 5)
    const posts = await Post.find(search)
      .populate({
        path: 'user',
        select: 'nickName',
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .skip((page - 1) * 5)
    const returnPosts = posts.map((post) => {
      return {
        _id: post._id,
        photo: post.photos[0],
        user: post.user.nickName,
        tags: post.tags,
        likesLength: post.likes.length,
        commentsLength: post.comments.length,
        createdAt: post.createdAt,
      }
    })

    res.json({
      pagination,
      posts: returnPosts,
    })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const getPostByAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'nickName photo',
      })
      .populate({
        path: 'comments.user',
        select: '_id nickName photo',
      })
      .populate({
        path: 'likes.user',
        select: '_id as user nickName photo',
      })
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }

    res.json(post)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const deletePostByAdmin = async (req, res) => {
  const { id } = req.params
  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }

    await post.deleteOne()
    res.json({ message: '刪除貼文成功' })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const deletePostCommentByAdmin = async (req, res) => {
  const { id, commentId } = req.params
  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    const index = post.comments.findIndex((item) => `${item._id}` === commentId)
    if (index === -1) {
      return res.status(400).json({ message: '沒有匹配的留言ID' })
    }
    post.comments.splice(index, 1)
    await post.save()
    res.json({ message: '刪除留言成功' })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

module.exports = {
  getAllTags,
  getAllPosts,
  getPostById,
  getPostsByUserId,
  deleteAllPosts,
  createPost,
  updatePostById,
  deletePostById,
  createPostLike,
  updatePostLike,
  createPostComment,
  updatePostComment,
  deletePostComment,
  getRandomPosts,
  getAllPostsByAdmin,
  getPostByAdmin,
  deletePostByAdmin,
  deletePostCommentByAdmin,
}
