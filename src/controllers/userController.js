const userModel = require('../models/userModel')
const User = require('../models/user-model')

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
    const users = await User.find()
    if (!users.length) {
      console.log('no user')
      return res.status(204).json({ message: 'no user found' })
    }

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const getUserInfoById = async (req, res) => {
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

const updateUserInfoById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(400).json({ message: '沒有匹配的用戶ID' })
    }

    const { name, nickName, phone, points } = req.body
    user.name = name
    user.nickName = nickName
    user.phone = phone
    user.points += points
    await user.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const donatePointsById = async (req, res) => {
  try {
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

module.exports = {
  getUserData,
  getUsersInfo,
  getUserInfoById,
  updateUserInfoById,
  donatePointsById,
}
