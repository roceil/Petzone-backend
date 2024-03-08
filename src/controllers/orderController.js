const Order = require('../models/order-model')
const { getTokenInfo } = require('../lib')

function generateRandomNumber() {
  return Math.floor(100000 + Math.random() * 900000)
}

// 新增訂單並回傳訂單ID
const createOrder = async (req, res) => {
  console.log(req.body)
  try {
    const newOrder = new Order({ orderId: generateRandomNumber(), ...req.body })
    // console.log(newOrder)
    await newOrder.save()
    return res
      .status(200)
      .send({ message: '訂單新增成功', orderId: newOrder._id })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error.message })
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
      return res.status(400).json({ message: '找不到該筆訂單' })
    }

    return res.status(200).send({ order: orderExist })
  } catch (err) {
    return res.status(500).send({ message: err.message })
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

const getOrderByUserId = async (req, res) => {
  console.log(req)
  const authCheck = await getTokenInfo(req)
  if (!authCheck) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  const userId = req.params.id

  try {
    const orders = await Order.find({ 'recipient.userId': userId })
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
  getOrderByUserId,
}
