const Product = require('../models/product-model')
const User = require('../models/user-model')

// 前台會員新增商品評論
async function userPostProductReview(req, res) {
  // console.log(req.params, req.body)

  try {
    const productId = req.params.productId
    const userId = req.body.userId
    const newReview = {
      ...req.body,
      createAt: new Date(),
      updatedAt: new Date(),
    }
    // console.log(productId, newReview)

    const currentProduct = await Product.findOne({ _id: productId }).exec()
    if (currentProduct.length === 0) {
      return res.status(200).json({ message: '找不到該產品' })
    }
    const reviews = currentProduct.review
    console.log(currentProduct, reviews)
    const hasReview = reviews.find((item) => {
      return item.userId === userId
    })
    if (hasReview) {
      return res.status(200).send({ message: '您已評論過該商品' })
    } else {
      Product.findOneAndUpdate(
        { _id: productId },
        { $set: { review: newReview } },
        { new: true }
      )
        .exec()
        .then((updatedProduct) => {
          if (updatedProduct) {
            return res.status(200).send({ message: '儲存商品評論成功' })
          } else {
            console.log('未找到產品')
          }
        })
        .catch((error) => {
          console.error('更新时出錯：', error)
        })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// 取得產品評論
async function getProductReviews(req, res) {
  const productId = req.params.productId
  try {
    const currentProduct = await Product.findOne({
      _id: productId,
    }).exec()

    if (currentProduct.length === 0) {
      return res.status(200).json({ message: '找不到該產品' })
    }
    // console.log(currentProduct.review)

    const reviews = currentProduct.review
    const productReviews = await Promise.all(
      reviews.map(async (item) => {
        const user = await User.findOne({
          _id: item.userId,
        }).exec()

        return { ...item, nickName: user.nickName, photo: user.photo }
      })
    )

    console.log(productReviews)

    return res.send(productReviews)
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}

module.exports = {
  userPostProductReview,
  getProductReviews,
}
