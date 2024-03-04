const mongoose = require('mongoose')

// 原因轉換器
const reasonConverter = value => {
  const reasons = {
    1: '發文',
    2: '按讚',
    3: '留言',
    4: '訂單紅利',
    5: '訂單折抵',
    6: '捐贈',
  }

  switch (value) {
    case 1:
      return reasons[1]
    case 2:
      return reasons[2]
    case 3:
      return reasons[3]
    case 4:
      return reasons[4]
    case 5:
      return reasons[5]
    case 6:
      return reasons[6]
    default:
      return 1
  }
}

// 定義 pointsRecord 的 Schema
const pointsRecordSchema = new mongoose.Schema({
  changePoints: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    enum: ['發文', '按讚', '留言', '訂單紅利', '訂單折抵', '捐贈'], // 定義原由的枚舉值
    set: reasonConverter,
    required: true,
  },
  beforePoints: {
    type: Number,
    required: true,
  },
  afterPoints: {
    type: Number,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now, // 設置默認值為當前時間
  },
})

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    googleID: {
      type: String,
    },
    photo: {
      type: String,
      default:
        'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    },
    // local login
    account: {
      type: String,
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 1024,
    },
    nickName: {
      type: String,
      maxLength: 8,
    },
    intro: {
      type: String,
      maxLength: 200,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    historyPoints: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    pointsRecord: {
      type: [pointsRecordSchema],
      default: [],
    },
    cart: {
      type: Array,
    },
    permission: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('User', userSchema)
