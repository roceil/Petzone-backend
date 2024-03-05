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

// 取得會員購物車資料
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

// 更新會員購物車資料
const updateCart = async (req, res) => {
  try {
    // console.log(req.params, req.body)

    const userId = req.params.userId
    const productId = req.body.productId
    const newQty = req.body.qty
    console.log(userId, productId, newQty)
    User.findOneAndUpdate(
      { _id: userId, 'cart.productId': productId },
      { $set: { 'cart.$.qty': newQty } },
      { new: true }
    )
      .exec()
      .then((updatedUser) => {
        if (updatedUser) {
          return res.status(200).send({ message: '儲存購物車成功' })
        } else {
          console.log('未找到該用戶或產品')
        }
      })
      .catch((error) => {
        console.error('更新时出錯：', error)
      })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// 刪除會員購物車單一品項
const deleteFromCart = async (req, res) => {
  try {
    console.log(req.params)

    const userId = req.params.userId
    const productId = req.params.productId
    console.log(userId, productId)
    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { cart: { productId: productId } } },
      { new: true }
    )
      .then((updatedUser) => {
        if (updatedUser) {
          return res.status(200).send({ message: '刪除購物車中該產品成功' })
        } else {
          console.log('未找到該用户或產品')
        }
      })
      .catch((error) => {
        console.error('刪除時出錯：', error)
      })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteCart = async (req, res) => {
  try {
    console.log(req.params)

    const userId = req.params.userId
    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { cart: {} } },
      { new: true }
    )
      .then((updatedUser) => {
        if (updatedUser) {
          return res.status(200).send({ message: '刪除購物車成功' })
        } else {
          console.log('未找到該用户或產品')
        }
      })
      .catch((error) => {
        console.error('刪除時出錯：', error)
      })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  addToCart,
  getCart,
  updateCart,
  deleteFromCart,
  deleteCart,
}
