const Product = require("../models/product");

// 前台產品相關
async function userGetProducts(req, res) {
  console.log(req.query.category);

  if (!req.query.category) {
    try {
      const Allproduct = await Product.find({ isEnabled: true }).exec();
      if (Allproduct) {
        console.log(Allproduct);
        return res.send({ success: true, products: Allproduct });
      } else {
        return res.send({ success: false, message: "產品不存在" });
      }
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: err.message,
      });
    }
  } else {
    try {
      const Allproduct = await Product.find({
        "category.type": req.query.category,
        isEnabled: true,
      }).exec();

      if (Allproduct.length === 0) {
        return res.send({ success: false, message: "查無產品" });
      }

      return res.send({ success: true, products: Allproduct });
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: err.message,
      });
    }
  }
}

async function userGetProduct(req, res) {
  console.log(req.params);
  const { productId } = req.params;

  try {
    const productExist = await Product.find({
      _id: productId,
      isEnabled: true,
    }).exec();

    if (productExist.length === 0) {
      return res.send({ success: false, message: "產品不存在" });
    }

    return res.send({ success: true, product: productExist });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: err.message,
    });
  }
}

// 後台產品相關
async function addProduct(req, res) {
  console.log(req.body);
  let product = req.body;
  try {
    const productExist = await Product.findOne({ name: product.name }).exec();

    if (!productExist) {
      const newProductData = { ...product, createAt: new Date().getTime() };
      console.log(newProductData);
      const newProduct = new Product({ ...newProductData });

      await newProduct.save();
      return res.send({
        success: true,
        message: "新增產品成功",
      });
    } else {
      return res.send({
        success: false,
        message: "該產品已存在",
      });
    }
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: err.message,
    });
  }
}

async function deleteProduct(req, res) {
  console.log(req.params);
  const { productId } = req.params;
  try {
    const productExist = await Product.findOne({ _id: productId }).exec();

    if (productExist) {
      try {
        await Product.deleteOne({ _id: productId }).exec();
        return res.send({
          success: true,
          message: "已刪除該產品",
        });
      } catch (err) {
        return res.status(400).send({
          success: false,
          message: err.message,
        });
      }
    } else {
      return res.send({
        success: false,
        message: "該產品不存在",
      });
    }
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: err.message,
    });
  }
}

async function updateProduct(req, res) {
  console.log(req.params, req.body);
  const { productId } = req.params;
  const product = req.body;
  try {
    const productExist = await Product.findOne({ _id: productId }).exec();

    if (productExist) {
      let updateProduct = await Product.findOneAndUpdate(
        {
          _id: productId,
        },
        {
          ...product,
          updateAt: new Date().getTime(),
        }
      ).exec();
      await updateProduct.save();
      return res.send({
        success: true,
        message: "已更新產品",
      });
    } else {
      return res.send({
        success: false,
        message: "該產品不存在",
      });
    }
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: err.message,
    });
  }
}

async function getProducts(req, res) {
  console.log(req.query.category);
  try {
    const Allproduct = await Product.find({}).exec();
    if (Allproduct) {
      console.log(Allproduct);
      return res.send({ success: true, products: Allproduct });
    } else {
      return res.send({ success: false, message: "產品不存在" });
    }
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: err.message,
    });
  }
}

async function getProduct(req, res) {
  console.log(req.params);
  const { productId } = req.params;

  try {
    const productExist = await Product.find({ _id: productId }).exec();

    if (productExist.length === 0) {
      return res.send({ success: false, message: "產品不存在" });
    }

    return res.send({ success: true, product: productExist });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: err.message,
    });
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
};
