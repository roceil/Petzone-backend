const jwt = require("jsonwebtoken");

const User = require('../models/user-model')
const mongoose = require('mongoose')

// 檢查 userId 是否有存在於資料庫
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

// 檢查 id 是否符合 MongoDB ObjectId 格式
const checkObjectId = id => {
  return mongoose.Types.ObjectId.isValid(id)
}

// 取得 req.headers 傳入的 token 之 UserInfo
const getTokenInfo = req => {
  const token = req.headers.authorization.split(' ')[1];
  const { UserInfo } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return UserInfo
}

module.exports = {
  checkUserId,
  checkObjectId,
  getTokenInfo
}