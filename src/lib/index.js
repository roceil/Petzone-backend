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

module.exports = {
  checkUserId,
  checkObjectId,
}