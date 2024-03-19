const Order = require('../models/order-model')
const User = require('../models/user-model')
const { getTokenInfo } = require('../lib')

// 自定義 OrderId
function generateRandomNumber() {
  return Math.floor(100000 + Math.random() * 900000)
}

// 新增訂單並回傳訂單ID
const createOrder = async (req, res) => {
  try {
    const newOrder = new Order({ orderId: generateRandomNumber(), ...req.body })
    // console.log(newOrder)
    await newOrder.save()

    // 如為會員使用積分折抵存入會員資料
    if (req.body.pointsDiscount !== 0) {
      const userId = req.body.recipient.userId
      const currentUser = await User.findById({ _id: userId })

      const usedPoints = -req.body.pointsDiscount * 10
      currentUser.pointsRecord.push({
        changePoints: -usedPoints,
        reason: 5,
        beforePoints: currentUser.points,
        afterPoints: currentUser.points - usedPoints,
        createAt: new Date(),
      })
      currentUser.points -= usedPoints

      await currentUser.save()
    }

    return res
      .status(200)
      .send({ message: '訂單新增成功', orderId: newOrder._id })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error.message })
  }
}

// 取得單一訂單資訊
const getOrderByOrderId = async (req, res) => {
  const orderId = req.params.id

  try {
    const orderExist = await Order.find({
      _id: orderId,
    }).exec()

    if (orderExist.length === 0) {
      return res.status(400).json({ message: '找不到該筆訂單' })
    }

    return res.status(200).send({ order: orderExist[0] })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

// 會員取得訂單 By User ID
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

// 後台取得所有訂單
const getAllOrders = async (req, res) => {
  try {
    const { orderId, recipient, status, page } = req.query
    const searchOrderId = orderId ? { orderId } : []
    const searchRecipient = recipient
      ? { 'recipient.email': new RegExp(recipient) }
      : {}
    const searchStatus = status ? { status: +status } : {}
    const searchParams = {
      ...searchOrderId,
      ...searchRecipient,
      ...searchStatus,
    }
    const pagination = Math.ceil((await Order.countDocuments(searchParams)) / 5)
    const orders = await Order.find(searchParams)
      .limit(5)
      .skip((page - 1) * 5)
      .select('_id orderId createdAt totalPrice finalPrice recipient status')

    if (!orders.length) {
      console.log('查無相關訂單')
      return res.status(200).send({
        pagination: 0,
        results: orders.length,
        message: '查無相關訂單',
      })
    }

    res.status(200).json({
      pagination,
      results: orders.length,
      data: { orders },
    })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

// 後台修改訂單資料
async function UpdateOrder(req, res) {
  console.log(req.params, req.body)
  const orderId = req.params.id
  const recipient = req.body.recipient
  const paymentType = parseInt(req.body.paymentType)

  try {
    const orderExist = await Order.findOne({ _id: orderId }).exec()

    if (orderExist) {
      Order.findOneAndUpdate(
        { _id: orderId },
        { $set: { recipient: recipient, paymentType: paymentType } },
        { new: true }
      )
        .exec()
        .then((updatedOrder) => {
          if (updatedOrder) {
            return res.status(200).send({ message: '更新訂單成功' })
          }
        })
        .catch((error) => {
          console.error('更新時出錯：', error.message)
        })
    } else {
      return res.status(400).send({ message: '該訂單不存在' })
    }
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderByOrderId,
  getOrderByUserId,
  UpdateOrder,
}
