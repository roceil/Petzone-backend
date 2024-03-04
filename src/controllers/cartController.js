const User = require('../models/user-model')

// 購物車資料存入會員資料
const addToCart = async (req, res) => {
  try {
    // console.log(req.params, req.body)

    const userId = req.params.userId
    const newCart = { cart: req.body }

    User.findByIdAndUpdate(userId, newCart, { new: true })
      .exec()
      .then((updatedUser) => {
        if (updatedUser) {
          return res.status(200).send({ message: '儲存購物車成功' })
        } else {
          console.log('未找到該用戶')
        }
      })
      .catch((error) => {
        console.error('更新时出错：', error)
      })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getCart = async (req, res) => {
  // console.log(req.params)

  const userId = req.params.userId

  try {
    const UserExist = await User.findOne({ _id: userId }).exec()
    return res.status(200).send(UserExist.cart)
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}

module.exports = {
  addToCart,
  getCart,
}
