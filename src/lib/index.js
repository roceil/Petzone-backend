const jwt = require('jsonwebtoken')

// 取得 req.headers 傳入的 token 之 UserInfo
const getTokenInfo = (req) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const { UserInfo } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    return UserInfo
  } catch (error) {
    return false
  }
}

module.exports = {
  getTokenInfo,
}
