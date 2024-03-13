const Product = require('../models/product-model')
const User = require('../models/user-model')
const { getTokenInfo } = require('../lib')

// 前台會員新增商品評論
async function userPostProductReview(req, res) {
  const authCheck = await getTokenInfo(req)
  if (!authCheck) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  console.log(req.params, req.body)
  const productId = req.params.productId
  const userId = req.body.userId
  const newReview = {
    ...req.body,
    createAt: new Date(),
    updatedAt: new Date(),
  }
  // console.log(productId, newReview)
  try {
    const currentProduct = await Product.findOne({ _id: productId }).exec()
    if (currentProduct.length === 0) {
      console.log('找不到該產品')
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
        { $push: { review: newReview } },
        { new: true }
      )
        .exec()
        .then((updatedProduct) => {
          if (updatedProduct) {
            return res.status(200).send({ message: '儲存商品評論成功' })
          }
        })
        .catch((error) => {
          console.error('儲存时出錯：', error.message)
        })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 前台、後台取得商品評論
async function getProductReviews(req, res) {
  console.log(req.params)
  const productId = req.params.productId
  try {
    const currentProduct = await Product.findOne({
      _id: productId,
    }).exec()

    if (currentProduct.length === 0) {
      return res.status(204).json({ message: '找不到該產品' })
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
    return res.status(500).send({ message: err.message })
  }
}

// 前台會員更新產品評論
async function userUpdateProductReview(req, res) {
  const authCheck = await getTokenInfo(req)
  if (!authCheck) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  console.log(req.params, req.body)
  const productId = req.params.productId
  const userId = req.params.userId
  const score = req.body.score
  const content = req.body.content
  try {
    const currentProduct = await Product.findOne({ _id: productId }).exec()
    if (currentProduct.length === 0) {
      console.log('找不到該產品')
    }

    Product.findOneAndUpdate(
      { _id: productId, 'review.userId': userId },
      { $set: { 'review.$.score': score, 'review.$.content': content } },
      { new: true }
    )
      .exec()
      .then((updatedProduct) => {
        if (updatedProduct) {
          return res.status(200).send({ message: '更新商品評論成功' })
        }
      })
      .catch((error) => {
        console.error('更新時出錯：', error.message)
      })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 前台會員刪除產品評論
async function userDeleteProductReview(req, res) {
  const authCheck = await getTokenInfo(req)
  if (!authCheck) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  console.log(req.params, req.body)
  const productId = req.params.productId
  const userId = req.params.userId
  try {
    const currentProduct = await Product.findOne({ _id: productId }).exec()
    if (currentProduct.length === 0) {
      console.log('找不到該產品')
    }

    Product.findOneAndUpdate(
      { _id: productId, 'review.userId': userId },
      { $pull: { review: { userId: userId } } },
      { new: true }
    )
      .exec()
      .then((deleteReview) => {
        if (deleteReview) {
          return res.status(200).send({ message: '成功刪除商品評論' })
        }
      })
      .catch((error) => {
        console.error('刪除時出錯：', error.message)
      })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 後台刪除產品評論
async function deleteProductReview(req, res) {
  console.log(req.params, req.body)
  const productId = req.params.productId
  const userId = req.params.userId
  try {
    const currentProduct = await Product.findOne({ _id: productId }).exec()
    if (currentProduct.length === 0) {
      console.log('找不到該產品')
    }

    Product.findOneAndUpdate(
      { _id: productId, 'review.userId': userId },
      { $pull: { review: { userId: userId } } },
      { new: true }
    )
      .exec()
      .then((deleteReview) => {
        if (deleteReview) {
          return res.status(200).send({ message: '成功刪除商品評論' })
        }
      })
      .catch((error) => {
        console.error('刪除時出錯：', error.message)
      })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  userPostProductReview,
  getProductReviews,
  userUpdateProductReview,
  userDeleteProductReview,
  deleteProductReview,
}
