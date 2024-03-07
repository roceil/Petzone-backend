const jwt = require('jsonwebtoken')
const { reasons } = require('./enum')

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

// 部落格行爲更新積分
const updatePoints = async (user, reason, defaultPoints) => {
  const today = new Date().toISOString().split('T')[0]
  const records = user.pointsRecord
  const todayRecords = records.filter((record) => {
    return record.createAt.toISOString().split('T')[0] === today
  })
  let todayTotalPoints = 0
  todayRecords.forEach((record) => {
    if (
      [1, 2, 3].includes(
        +Object.keys(reasons).find((key) => reasons[key] === record.reason)
      )
    ) {
      todayTotalPoints += record.changePoints
    }
  })
  const canGetPoints = 20 - todayTotalPoints
  if (canGetPoints > 0) {
    const getPoints =
      canGetPoints > defaultPoints ? defaultPoints : canGetPoints
    user.points += getPoints
    user.historyPoints += getPoints
    user.pointsRecord.push({
      changePoints: getPoints,
      reason,
      beforePoints: user.points - getPoints,
      afterPoints: user.points,
      createAt: new Date(),
    })
    await user.save()
  }
}

module.exports = {
  getTokenInfo,
  updatePoints,
}
