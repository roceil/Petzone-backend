const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const productReviewController = require('../controllers/productReviewController')
const uploadController = require('../controllers/uploadController')

// 前台取得全部產品資訊
router.get('/products', productController.userGetProducts)

// 前台取得單一產品資訊
router.get('/product/:productId', productController.userGetProduct)

// 前台會員新增商品評論
router.post(
  '/product/review/:productId',
  productReviewController.userPostProductReview
)

// 後台新增產品
router.post('/product', productController.addProduct)

// 後台刪除產品
router.delete('/product/:productId', productController.deleteProduct)

// 後台更新產品
router.put('/product/:productId', productController.updateProduct)

// 後台取得全部產品資訊
router.get('/products/admin', productController.getProducts)

// 後台取得單一產品資訊
router.get('/product/admin/:productId', productController.getProduct)

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
