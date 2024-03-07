const Product = require('../models/product-model')

// 前台取得全部產品資訊
async function userGetProducts(req, res) {
  // console.log(req.query);
  // console.log(Object.keys(req.query));

  // 分類搜尋
  if (Object.keys(req.query)[0] === 'category') {
    try {
      const Allproduct = await Product.find({
        $or: [
          { 'category.type': req.query.category },
          { 'category.type': 'all' },
        ],
        isEnabled: true,
      }).exec()
      if (Allproduct.length === 0) {
        return res.status(200).send({ message: '查無此商品' })
      }
      return res.send({ products: Allproduct })
    } catch (err) {
      return res.status(400).send({ message: err.message })
    }
    // 名稱搜尋
  } else if (Object.keys(req.query)[0] === 'name') {
    try {
      const Allproduct = await Product.find({
        name: req.query.name,
        isEnabled: true,
      }).exec()
      if (Allproduct.length === 0) {
        return res.status(200).send({ message: '查無此商品' })
      }
      return res.send({ products: Allproduct })
    } catch (err) {
      return res.status(400).send({ message: err.message })
    }
  } else {
    try {
      const Allproduct = await Product.find({ isEnabled: true }).exec()
      if (Allproduct) {
        // console.log(Allproduct);
        return res.send({ products: Allproduct })
      } else {
        return res.status(200).send({ message: '平台尚無商品' })
      }
    } catch (err) {
      return res.status(400).send({ message: err.message })
    }
  }
}

// 前台取得單一產品資訊
async function userGetProduct(req, res) {
  console.log(req.params)
  const { productId } = req.params

  try {
    const productExist = await Product.find({
      _id: productId,
      isEnabled: true,
    }).exec()

    if (productExist.length === 0) {
      return res.status(200).send({ message: '產品不存在' })
    }

    return res.send({ product: productExist[0] })
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}

// 後台新增產品
async function addProduct(req, res) {
  console.log(req.body)
  const product = req.body
  try {
    const productExist = await Product.findOne({ name: product.name }).exec()

    if (!productExist) {
      const newProduct = new Product({ product })
      await newProduct.save()
      return res.status(200).send({ message: '新增產品成功' })
    } else {
      return res.status(200).send({ message: '該產品已存在' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}

// 後台刪除產品
async function deleteProduct(req, res) {
  console.log(req.params)
  const { productId } = req.params
  try {
    const productExist = await Product.findOne({ _id: productId }).exec()

    if (productExist) {
      try {
        await Product.deleteOne({ _id: productId }).exec()
        return res.status(200).send({ message: '已刪除該產品' })
      } catch (err) {
        return res.status(400).send({ message: '刪除產品失敗' })
      }
    } else {
      return res.status(200).send({ message: '該產品不存在' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}

// 後台更新產品
async function updateProduct(req, res) {
  console.log(req.params, req.body)
  const { productId } = req.params
  const product = req.body
  try {
    const productExist = await Product.findOne({ _id: productId }).exec()

    if (productExist) {
      let updateProduct = await Product.findOneAndUpdate(
        {
          _id: productId,
        },
        {
          ...product,
          updateAt: new Date().getTime(),
        }
      ).exec()
      await updateProduct.save()
      return res.status(200).send({
        message: '已更新產品',
      })
    } else {
      return res.status(200).send({
        message: '該產品不存在',
      })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}

// 後台取得全部產品資訊
async function getProducts(req, res) {
  console.log(req.query.category)
  try {
    const Allproduct = await Product.find({}).exec()
    if (Allproduct) {
      console.log(Allproduct)
      return res.send({ products: Allproduct })
    } else {
      return res.status(200).send({ message: '尚無商品' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}

// 後台取得單一產品資訊
async function getProduct(req, res) {
  console.log(req.params)
  const { productId } = req.params

  try {
    const productExist = await Product.find({ _id: productId }).exec()

    if (productExist.length === 0) {
      return res.status(200).send({ message: '產品不存在' })
    }

    return res.send({ product: productExist })
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}

module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProduct,
  userGetProducts,
  userGetProduct,
}
