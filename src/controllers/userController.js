const dayjs = require('dayjs')
const { getTokenInfo } = require('../lib')
const userModel = require('../models/userModel')
const User = require('../models/user-model')
const APIFeatures = require('../utils/apiFeatures')

async function getUserData(req, res) {
  try {
    const data = await userModel.getUsers('test')
    res.json(data)
  } catch (error) {
    res.status(500).send(error)
  }
}

const getUsersInfo = async (req, res) => {
  try {
    // const users = await User.find();
    const authCheck = await getTokenInfo(req)
    if (!authCheck) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const users = await features.query

    if (!users.length) {
      console.log('no user')
      return res.status(204).json({ message: 'no user found' })
    }

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const getUserInfo = async (req, res) => {
  try {
    const { userId } = req
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const getUserInfoById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      '_id photo nickName intro'
    )
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const updateUserInfo = async (req, res) => {
  try {
    const { userId } = req
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }

    const { name, photo, intro, nickName, phone, address } = req.body

    user.name = name || user.name
    user.photo = photo || user.photo
    user.intro = intro || user.intro
    user.nickName = nickName || user.nickName
    user.phone = phone || user.phone
    user.address = address || user.address

    await user.save()
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const donatePoints = async (req, res) => {
  try {
    const { userId } = req
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }

    // 檢查是否有足夠的點數
    if (user.points < req.body.points) {
      return res.status(400).json({ message: '用戶點數不足' })
    }

    // 記錄點數變動
    const pointsDeducted = req.body.points
    user.points -= pointsDeducted
    user.pointsRecord.push({
      changePoints: -pointsDeducted,
      reason: 6, // 6 代表捐贈
      beforePoints: user.points + pointsDeducted,
      afterPoints: user.points,
      createAt: new Date(),
    })

    await user.save()

    res.json({
      message: '捐贈成功',
      donatedPoints: pointsDeducted,
      remainingPoints: user.points,
    })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const deleteAllUsers = async (req, res) => {
  try {
    const authCheck = await getTokenInfo(req)
    if (!authCheck) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    await User.deleteMany()
    res.json({ message: '刪除所有用戶成功' })
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const addPointsRecord = async (req, res) => {
  try {
    const authCheck = await getTokenInfo(req)
    if (!authCheck) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    const { userId } = getTokenInfo(req)

    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({ message: 'userId 不存在' })
    }

    const { changePoints, reason } = req.body

    console.log('findUser', user)

    // 寫入積分變動記錄
    const newRecord = {
      changePoints,
      reason,
      beforePoints: user.points,
      afterPoints: user.points + changePoints,
      createAt: new Date(),
    }
    user.pointsRecord.push(newRecord)

    // 更新用戶積分
    user.points += changePoints

    // 存檔
    await user.save()
    res.json({
      message: '新增積分記錄成功',
      newRecord,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'something went wrong' })
  }
}

const getBestDonator = async (req, res) => {
  try {
    const users = await User.find()
    const currentMonth = dayjs().month() // 獲取當前月份
    const currentYear = dayjs().year() // 獲取當前年份

    let totalDonation = 0
    const userDonations = users.map((user) => {
      const monthlyDonations = user.pointsRecord
        .filter((record) => {
          const recordMonth = dayjs(record.createAt).month()
          const recordYear = dayjs(record.createAt).year()
          return (
            record.reason === '捐贈' &&
            recordMonth === currentMonth &&
            recordYear === currentYear
          )
        })
        .reduce((acc, curr) => acc + Math.abs(curr.changePoints), 0) // 將 changePoints 從負數轉為正數後加總

      totalDonation += monthlyDonations

      return {
        userId: user._id,
        name: user.name,
        monthlyDonations,
        photo: user.photo,
      }
    })

    // 根據捐款金額排序並選出前四位
    const topDonators = userDonations
      .sort((a, b) => b.monthlyDonations - a.monthlyDonations)
      .slice(0, 4)

    res.json({ topDonators, totalDonation })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const { account, nickName, permission, page } = req.query
    const searchAccount = account ? { account: new RegExp(account) } : {}
    const searchNickName = nickName ? { nickName: new RegExp(nickName) } : {}
    const searchPermission =
      permission === 'user'
        ? { permission: { $ne: 'admin' } }
        : permission
        ? { permission }
        : {}

    const searchParams = {
      ...searchAccount,
      ...searchNickName,
      ...searchPermission,
    }
    const totalPages = Math.ceil((await User.countDocuments(searchParams)) / 5)
    const users = await User.find(searchParams)
      .limit(5)
      .skip((page - 1) * 5)
      .select('_id account name nickName permission')

    res.json({
      users,
      totalPages,
    })
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const getUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const getUserPointsByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }
    res.json(user.pointsRecord)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }

    await user.deleteOne()
    res.json({ message: '刪除用戶成功' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'something went wrong' })
  }
}

const updateUserPermissionByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }

    user.permission = req.body.permission

    await user.save()
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'something went wrong' })
  }
}


module.exports = {
  getUserData,
  getUsersInfo,
  getUserInfo,
  getUserInfoById,
  updateUserInfo,
  donatePoints,
  deleteAllUsers,
  addPointsRecord,
  getBestDonator,
  getAllUsers,
  getUserByAdmin,
  getUserPointsByAdmin,
  deleteUserByAdmin,
  updateUserPermissionByAdmin,
}
