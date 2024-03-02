const jwt = require("jsonwebtoken");

const User = require('../models/user-model')
const mongoose = require('mongoose')

// 檢查 userId 是否有存在於資料庫
const checkUserId = async (userId, res) => {
  if(!userId) {
    return res.status(400).json({ message: 'userId 不存在' })
  }
  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({ message: 'userId 不存在' })
    }
  } catch (error) {
    return res.status(400).json({ message: 'userId 不存在' })
  }
}

// 檢查 id 是否符合 MongoDB ObjectId 格式
const checkObjectId = (id, res) => {
  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: '無效的ID格式' })
  }
}

// 取得 req.headers 傳入的 token 之 UserInfo
const getTokenInfo = req => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { UserInfo } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return UserInfo
  } catch (error) {
    return false
  }
  
}

module.exports = {
  checkUserId,
  checkObjectId,
  getTokenInfo
}