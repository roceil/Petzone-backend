const mongoose = require('mongoose')

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

function category(val) {
  return categoryList[val] || null
}

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Object,
      set: category,
      required: true,
    },
    photos: {
      type: Array,
      default: [],
      required: true,
    },
    originPrice: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      minLength: 3,
      maxLength: 255,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      required: true,
    },
    review: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)
module.exports = Product
