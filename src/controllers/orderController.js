const Order = require("../models/order-model");
const { checkUserId, checkObjectId } = require("../lib");

// 新增訂單
const createOrder = async (req, res) => {
  console.log(req.body);
  const newOrder = new Order(req.body);
  try {
    await newOrder.save();
    return res.status(200).send({ message: "訂單新增成功" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders.length) {
      return res.status(202).json({ message: "尚無訂單" });
    }

    res.json({
      status: "success",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "請檢查API格式或參數是否有誤" });
  }
};

const getOrderByOrderId = async (req, res) => {
  const { id } = req.params;
  if (!checkObjectId(id)) {
    return res.status(400).json({ message: "orderId 格式錯誤" });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({ message: "找不到訂單" });
    }
    res.json({ status: "success", order });
  } catch (error) {
    res.status(500).json({ message: "請檢查API格式或參數是否有誤" });
  }
};

module.exports = {
  getAllOrders,
  getOrderByOrderId,
  createOrder,
};
