const { checkUserId, getTokenInfo } = require('../lib')
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

const getUserInfoById = async (req, res) => {
  try {
    const authCheck = await getTokenInfo(req)
    if (!authCheck) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const updateUserInfoById = async (req, res) => {
  try {
    const authCheck = await getTokenInfo(req)
    if (!authCheck) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }

    const {
      name,
      photo,
      intro,
      historyPoints,
      points,
      pointsRecord,
      cart,
      nickName,
      phone,
    } = req.body

    user.name = name || user.name
    user.photo = photo || user.photo
    user.intro = intro || user.intro
    user.historyPoints = historyPoints || user.historyPoints
    user.points = points || user.points
    user.pointsRecord = pointsRecord || user.pointsRecord
    user.cart = cart || user.cart
    user.nickName = nickName || user.nickName
    user.phone = phone || user.phone

    await user.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const donatePointsById = async (req, res) => {
  try {
    const authCheck = await getTokenInfo(req)
    if (!authCheck) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }

    // 檢查是否有足夠的點數
    if (user.points < req.body.points) {
      return res.status(400).json({ message: '用戶點數不足' })
    }

    user.points -= req.body.points
    await user.save()
    res.json(user)
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

const getSelfId = async (req, res) => {
  try {
    const { userId } = getTokenInfo(req)

    // 檢查 userId 是否有存在於資料庫
    checkUserId(userId, res)

    res.json(userId)
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

module.exports = {
  getUserData,
  getUsersInfo,
  getUserInfoById,
  updateUserInfoById,
  donatePointsById,
  deleteAllUsers,
  getSelfId,
}
