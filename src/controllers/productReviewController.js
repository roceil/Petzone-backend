const Product = require('../models/product-model')

// 前台會員新增商品評論
async function userPostProductReview(req, res) {
  console.log(req.params, req.body)

  try {
    const productId = req.params.productId
    const newReview = { ...req.body, createAt: new Date().getTime() }
    console.log(productId, newReview)
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
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  userPostProductReview,
}
