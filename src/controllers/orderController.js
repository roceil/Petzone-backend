const Order = require('../models/order-model')
const { checkUserId, checkObjectId } = require('../lib')

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
    if (!orders.length) {
      return res.status(202).json({ message: '尚無訂單' })
    }

    res.json({
      status: 'success',
      totalOrders: orders.length,
      orders,
    })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      recipient,
      email,
      address,
      phone,
      products,
      totalPrice,
      couponDiscount,
      pointsDiscount,
      finalPrice,
      paymentType,
      status,
    } = req.body

    if (!checkUserId(userId)) {
      return res.status(400).json({ message: 'userId 格式錯誤' })
    }

    // 檢查 products 數組中的每個 productId 是否有有效的格式
    const allProductsValid = products.every(product => checkObjectId(product))

    if (!allProductsValid) {
      return res
        .status(400)
        .json({ message: '一個或多個 products ID 格式錯誤' })
    }

    const newOrder = new Order({
      userId,
      recipient,
      email,
      address,
      phone,
      products,
      totalPrice,
      couponDiscount,
      pointsDiscount,
      finalPrice,
      paymentType,
      status,
    })

    await newOrder.save()
    res.json({ message: '訂單新增成功', newOrder })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

const getOrderByOrderId = async (req, res) => {
  const { id } = req.params
  if (!checkObjectId(id)) {
    return res.status(400).json({ message: 'orderId 格式錯誤' })
  }

  try {
    const order = await Order.findById(id)
    if (!order) {
      return res.status(400).json({ message: '找不到訂單' })
    }
    res.json({ status: 'success', order })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

module.exports = {
  getAllOrders,
  getOrderByOrderId,
  createOrder,
}
