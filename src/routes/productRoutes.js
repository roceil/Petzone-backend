const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const productReviewController = require('../controllers/productReviewController')
const uploadController = require('../controllers/uploadController')
const { isUser, isAdmin } = require('../middleware/auth')

// 前台取得全部產品資訊
router.get('/products', productController.userGetProducts)

// 前台取得單一產品資訊
router.get('/product/:productId', productController.userGetProduct)

// 前台會員新增商品評論
router.post(
  '/product/review/:productId',
  isUser,
  productReviewController.userPostProductReview
)

// 前台、後台取得商品評論
router.get(
  '/product/reviews/:productId',
  productReviewController.getProductReviews
)

// 前台會員更新商品評論
router.put(
  '/product/review/:productId/:userId',
  isUser,
  productReviewController.userUpdateProductReview
)

// 前台會員刪除商品評價
router.delete(
  '/product/review/:productId/:userId',
  isUser,
  productReviewController.userDeleteProductReview
)

// 後台取得全部產品資訊
router.get('/products/admin', isAdmin, productController.getProducts)

// 後台取得單一產品資訊
router.get('/product/admin/:productId', isAdmin, productController.getProduct)

// 後台新增產品
router.post('/product', isAdmin, productController.addProduct)

// 後台更新產品
router.put('/product/:productId', isAdmin, productController.updateProduct)

// 後台刪除產品
router.delete('/product/:productId', isAdmin, productController.deleteProduct)

// 後台刪除商品評價
router.delete(
  '/product/admin/review/:productId/:userId',
  isAdmin,
  productReviewController.deleteProductReview
)

// 上傳單張照片
router.post(
  '/upload/image',
  uploadController.upload.single('file'),
  uploadController.uploadImage
)

// 上傳多張照片
router.post(
  '/upload/images',
  uploadController.upload.array('files', 3),
  uploadController.uploadImages
)

module.exports = router
