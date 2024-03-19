const Product = require('../models/product-model')

// 自定義 productId
function generateRandomNumber() {
  return Math.floor(100000 + Math.random() * 900000)
}

const categoryList = {
  1: { type: 'dog', name: '狗狗主食' },
  2: { type: 'dog', name: '狗狗零食' },
  3: { type: 'dog', name: '狗狗玩具與用品' },
  4: { type: 'dog', name: '貓貓主食' },
  5: { type: 'cat', name: '貓貓零食' },
  6: { type: 'cat', name: '貓貓玩具與用品' },
  7: { type: 'cat', name: '貓砂系列' },
  8: { type: 'all', name: '保健系列' },
  9: { type: 'all', name: '清潔系列' },
  10: { type: 'all', name: '通用玩具與生活用品' },
}

function category(name) {
  const key = Object.keys(categoryList).find(
    (key) => categoryList[key].name === name
  )

  return key ? key : null
}

// 前台取得全部產品資訊
async function userGetProducts(req, res) {
  // console.log(req.query)
  // console.log(Object.keys(req.query))

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
        return res.status(400).send({ message: '查無此商品' })
      }
      return res.status(200).send({ products: Allproduct })
    } catch (err) {
      return res.status(500).send({ message: err.message })
    }
    // 名稱搜尋
  } else if (Object.keys(req.query)[0] === 'name') {
    try {
      const Allproduct = await Product.find({
        name: { $regex: req.query.name, $options: 'i' },
        isEnabled: true,
      }).exec()
      if (Allproduct.length === 0) {
        return res.status(400).send({ message: '查無此商品' })
      }
      return res.status(200).send({ products: Allproduct })
    } catch (err) {
      return res.status(500).send({ message: err.message })
    }
  } else {
    try {
      const Allproduct = await Product.find({ isEnabled: true }).exec()
      if (Allproduct) {
        // console.log(Allproduct);
        return res.status(200).send({ products: Allproduct })
      } else {
        return res.status(400).send({ message: '平台尚無商品' })
      }
    } catch (err) {
      return res.status(500).send({ message: err.message })
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
      return res.status(400).send({ message: '產品不存在' })
    }

    return res.status(200).send({ product: productExist[0] })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

// 後台取得全部產品資訊
async function getProducts(req, res) {
  try {
    const { name, category, isEnabled, page } = req.query
    const searchName = name ? { name: new RegExp(name) } : {}
    const searchCategory = category ? { 'category.name': category } : {}
    const searchIsEnabled = isEnabled ? { isEnabled } : {}
    const searchParams = {
      ...searchName,
      ...searchCategory,
      ...searchIsEnabled,
    }
    const pagination = Math.ceil(
      (await Product.countDocuments(searchParams)) / 5
    )
    const products = await Product.find(searchParams)
      .limit(5)
      .skip((page - 1) * 5)
      .select('_id productId name category price quantity isEnabled')

    if (!products.length) {
      console.log('查無相關商品')
      return res.status(200).send({
        pagination: 0,
        results: products.length,
        message: '查無相關商品',
      })
    }

    res.status(200).json({
      pagination,
      results: products.length,
      data: { products },
    })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

// 後台取得單一產品資訊
async function getProduct(req, res) {
  console.log(req.params)
  const { productId } = req.params

  try {
    const productExist = await Product.find({ _id: productId }).exec()

    if (productExist.length === 0) {
      return res.status(400).send({ message: '產品不存在' })
    }

    const categoryKey = category(productExist[0].category.name)
    productExist[0].category.key = categoryKey
    console.log(productExist[0].category)

    return res.status(200).send({ product: productExist[0] })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

// 後台新增產品
async function addProduct(req, res) {
  console.log(req.body)
  const product = req.body

  try {
    const productExist = await Product.findOne({ name: product.name }).exec()

    if (!productExist) {
      const newProduct = new Product({
        productId: generateRandomNumber(),
        ...product,
      }).save()
      await newProduct
      return res.status(200).send({ message: '新增產品成功' })
    } else {
      return res.status(400).send({ message: '該產品已存在' })
    }
  } catch (err) {
    console.log(err.message)
    return res.status(500).send({ message: err.message })
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
      return res.status(200).send({ message: '更新產品成功' })
    } else {
      return res.status(400).send({ message: '該產品不存在' })
    }
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

// 後台刪除產品
async function deleteProduct(req, res) {
  console.log(req.params)
  const { productId } = req.params
  try {
    const productExist = await Product.findOne({ _id: productId }).exec()

    if (productExist) {
      await Product.deleteOne({ _id: productId }).exec()
      return res.status(200).send({ message: '已刪除該產品' })
    } else {
      return res.status(400).send({ message: '該產品不存在' })
    }
  } catch (err) {
    return res.status(500).send({ message: err.message })
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
