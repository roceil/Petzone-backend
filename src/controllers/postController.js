const mongoose = require('mongoose');

const Post = require('../models/post-model')
const User = require('../models/user-model')
const { checkUserId, checkObjectId, getTokenInfo } = require('../lib')

const getAllPosts = async (req, res) => {
  try {
    const { nickName } = req.query
    let searchNickName = {}
    if (nickName) {
      const users = await User.find({"nickName": { $regex: nickName, $options: 'i' }})
      const userIds = users.map(user => user._id);
      searchNickName = { user: { $in: userIds } }
    }
    const posts = await Post.find(searchNickName)
      .sort({ createdAt: -1 })
    const returnPosts = posts.map(post => {
      return {
        _id: post._id,
        photo: post.photos[0],
        likesLength: post.likes.length,
        commentsLength: post.comments.length
      }
    })

    res.json(returnPosts)
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: 'user',
      select: 'nickName photo'
    })
    console.log('post', post)
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
    const { userId } = req.params

    // 檢查 userId 是否有存在於資料庫
    checkUserId(userId, res)

    const user = new mongoose.Types.ObjectId(req.params.userId)
    const posts = await Post.find({ user })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const createPost = async (req, res) => {
  try {
    const { userId } = getTokenInfo(req)
    const { tags, photos, content } = req.body

    // 檢查 userId 是否有存在於資料庫
    checkUserId(userId, res)
    if (!content) {
      res.status(400).json({ message: 'content 必填' })
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
    res.json({message: '新增貼文成功'})
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const deleteAllPosts = async (req, res) => {
  try {
    await Post.deleteMany()
    res.json({ message: '刪除所有貼文成功' })
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const deletePostById = async (req, res) => {
  const { userId } = getTokenInfo(req)
  const { id } = req.params

  // 檢查 id 是否是一個有效的 MongoDB ObjectId
  checkObjectId(id, res)
  // 檢查 userId 是否有存在於資料庫
  checkUserId(userId, res)

  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    if (userId !== post.user) {
      return res.status(400).json({ message: '只可刪除自己的貼文' })
    }

    await post.deleteOne()
    res.json({ message: '刪除貼文成功' })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const updatePostById = async (req, res) => {
  const { userId } = getTokenInfo(req)
  const { id } = req.params

  // 檢查 id 是否是一個有效的 MongoDB ObjectId
  checkObjectId(id, res)
  // 檢查 userId 是否有存在於資料庫
  checkUserId(userId, res)

  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    if (userId !== `${post.user}`) {
      return res.status(400).json({ message: '只可更新自己的貼文' })
    }

    const { tags, photos, content } = req.body

    if (!content) {
      res.status(400).json({ message: 'content 必填' })
    }
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
  const { userId } = getTokenInfo(req)
  const { id } = req.params

  // 檢查 id 是否是一個有效的 MongoDB ObjectId
  checkObjectId(id, res)
  // 檢查 userId 是否有存在於資料庫
  checkUserId(userId, res)

  try {
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    if(post.likes.find(item => item.userId === userId)) {
      return res.status(400).json({ message: '已加入 likes 請用 put 更新' })
    }
    post.likes.push({
      userId,
      isLiked: true
    })
    await post.save()
    res.json({message: '點讚成功'})
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const updatePostLike = async (req, res) => {
  const { userId } = getTokenInfo(req)
  const { id } = req.params

  // 檢查 id 是否是一個有效的 MongoDB ObjectId
  checkObjectId(id, res)
  // 檢查 userId 是否有存在於資料庫
  checkUserId(userId, res)

  try {
    const { isLiked } = req.body
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    let index = post.likes.findIndex(item => item.userId === userId)
    if(index === -1) {
      return res.status(400).json({ message: '尚未加入 likes 請用 post 新增' })
    }
    post.likes[index] = {
      userId,
      isLiked
    }
    await post.save()
    res.json({message: '更新點讚成功'})
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const createPostComment = async (req, res) => {
  const { userId } = getTokenInfo(req)
  const { id } = req.params

  // 檢查 id 是否是一個有效的 MongoDB ObjectId
  checkObjectId(id, res)
  // 檢查 userId 是否有存在於資料庫
  checkUserId(userId, res)

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
      userId,
      content,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString()
    })
    await post.save()
    res.json({message: '新增留言成功'})
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const updatePostComment = async (req, res) => {
  const { userId } = getTokenInfo(req)
  const { id, commentId } = req.params

  // 檢查 id 是否是一個有效的 MongoDB ObjectId
  checkObjectId(id, res)
  checkObjectId(commentId, res)
  // 檢查 userId 是否有存在於資料庫
  checkUserId(userId, res)

  try {
    const { content } = req.body
    const post = await Post.findById(id)
    if (!post) {
      return res.status(400).json({ message: '沒有匹配的貼文ID' })
    }
    const index = post.comments.findIndex(item => `${item._id}` === commentId)
    if (index === -1) {
      return res.status(400).json({ message: '沒有匹配的留言ID' })
    }
    if (!content) {
      res.status(400).json({ message: 'content 必填' })
    }
    post.comments[index] = {
      _id: post.comments[index]._id,
      userId: post.comments[index].userId,
      content,
      createAt: post.comments[index].createAt,
      updateAt: new Date().toISOString()
    }
    console.log(post);
    await post.save()
    res.json({message: '更新留言成功'})
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}



module.exports = {
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
  updatePostComment
}
