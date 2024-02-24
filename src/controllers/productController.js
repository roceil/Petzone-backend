const Product = require('../models/product-model')
const { checkObjectId } = require('../lib')

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    if (!products.length) {
      return res.status(202).json({ message: '尚無商品' })
    }
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      photos,
      originPrice,
      price,
      quantity,
      unit,
      description,
      isEnabled,
      review,
    } = req.body
    const newProduct = new Product({
      name,
      category,
      photos,
      originPrice,
      price,
      quantity,
      unit,
      description,
      isEnabled,
      review,
    })
    await newProduct.save()
    res.json({ message: '新增商品成功', newProduct })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const getProductById = async (req, res) => {
  if (!checkObjectId(req.params.id)) {
    return res.status(400).json({ message: '請檢查商品ID格式' })
  }
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(400).json({ message: '沒有匹配的商品ID' })
    }
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const updateProductById = async (req, res) => {
  const { id } = req.params
  if (!checkObjectId(id)) {
    return res.status(400).json({ message: '無效的ID格式' })
  }
  try {
    const product = await Product.findById(id)
    if (!product) {
      return res.status(400).json({ message: '沒有匹配的商品ID' })
    }
    const {
      name,
      category,
      photos,
      originPrice,
      price,
      quantity,
      unit,
      description,
      isEnabled,
      review,
    } = req.body
    product.name = name || product.name
    product.category = category || product.category
    product.photos = photos || product.photos
    product.originPrice = originPrice || product.originPrice
    product.price = price || product.price
    product.quantity = quantity || product.quantity
    product.unit = unit || product.unit
    product.description = description || product.description
    product.isEnabled = isEnabled || product.isEnabled
    product.review = review || product.review
    await product.save()
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const deleteProductById = async (req, res) => {
  const { id } = req.params
  if (!checkObjectId(id)) {
    return res.status(400).json({ message: '無效的ID格式' })
  }
  try {
    const product = await Product.findById(id)
    if (!product) {
      return res.status(400).json({ message: '沒有匹配的商品ID' })
    }
    await product.deleteOne()
    res.json({ message: '刪除商品成功', productList: await Product.find()})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany()
    res.json({ message: '刪除所有商品成功' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  deleteAllProducts,
}
