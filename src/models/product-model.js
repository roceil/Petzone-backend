const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Number,
      required: true,
    },
    photos: {
      type: Array,
      default: [],
      required: true,
      items: {
        type: String,
      },
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
    },
    isEnabled: {
      type: Boolean,
      default: true,
      required: true,
    },
    review: {
      type: Array,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Product', productSchema)
