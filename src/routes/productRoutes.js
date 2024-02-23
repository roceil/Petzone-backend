const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const uploadController = require("../controllers/uploadController");

// 前台產品相關

// 後台產品相關
router.post("/product", productController.addProduct);
router.delete("/product/:productId", productController.deleteProduct);
router.put("/product/:productId", productController.updateProduct);
router.get("/products/admin", productController.getProducts);
router.get("/product/admin/:productId", productController.getProduct);
router.post(
  "/upload/image",
  uploadController.upload.single("file"),
  uploadController.uploadImage
);

module.exports = router;
