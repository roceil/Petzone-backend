const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const isUser = async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return res.status(401).json({ error: '登入過期或驗證失敗！' })
  }
  try {
    const { UserInfo } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const { userId } = UserInfo
    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ error: 'userId 不存在' })
    }
    req.userId = userId
    next()
  } catch (error) {
    return res.status(401).json({ error: '登入過期或驗證失敗！' })
  }
}

const isAdmin = async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return res.status(401).json({ error: '登入過期或驗證失敗！' })
  }
  try {
    const { UserInfo } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const { userId } = UserInfo
    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ error: 'userId 不存在' })
    }
    if (user.permission !== 'admin') {
      return res.status(403).json({ error: '您沒有權限進行此操作' })
    }
    req.userId = userId
    next()
  } catch (error) {
    return res.status(401).json({ error: '登入過期或驗證失敗！' })
  }
}

module.exports = { isUser, isAdmin }
