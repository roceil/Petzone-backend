const Order = require('../models/order-model')

// 新增訂單並回傳訂單ID
const createOrder = async (req, res) => {
  console.log(req.body)
  const newOrder = new Order(req.body)
  try {
    await newOrder.save()
    return res
      .status(200)
      .send({ message: '訂單新增成功', orderId: newOrder._id })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ message: error.message })
  }
}

//取得單一訂單資訊
const getOrderByOrderId = async (req, res) => {
  const orderId = req.params.id

  try {
    const orderExist = await Order.find({
      _id: orderId,
    }).exec()

    if (orderExist.length === 0) {
      return res.status(200).json({ message: '找不到該筆訂單' })
    }

    return res.send({ order: orderExist })
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}

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

module.exports = {
  createOrder,
  getAllOrders,
  getOrderByOrderId,
}
