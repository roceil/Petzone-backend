const mongoose = require('mongoose')

// 付款方式轉換器
const paymentTypeConverter = (value) => {
  const paymentTypes = {
    1: 'cash',
    2: 'card',
  }

  switch (value) {
    case 1:
      return paymentTypes[1]
    case 2:
      return paymentTypes[2]
    default:
      return 1
  }
}

// 訂單狀態轉換器
const statusConverter = (value) => {
  const statuses = {
    1: 'unPaid',
    2: 'hasPaid',
    3: 'done',
    4: 'cancel',
  }

  switch (value) {
    case 1:
      return statuses[1]
    case 2:
      return statuses[2]
    case 3:
      return statuses[3]
    case 4:
      return statuses[4]
    default:
      return 1
  }
}

const orderSchema = new mongoose.Schema(
  {
    recipient: {
      userId: {
        type: String,
        default: null,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
        minLength: 10,
      },
    },
    products: {
      type: Array,
      required: true,
      default: [],
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    couponDiscount: {
      type: Number,
      required: true,
      default: 0,
    },
    pointsDiscount: {
      type: Number,
      required: true,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentType: {
      type: String, // 修改字段類型為 String
      enum: ['cash', 'card'], // 使用字符串值
      set: paymentTypeConverter, // 保留轉換函數
      required: true,
    },
    status: {
      type: String, // 修改字段類型為 String
      enum: ['unPaid', ' hasPaid', 'done', 'cancel'], // 使用字符串值
      set: statusConverter, // 保留轉換函數
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
