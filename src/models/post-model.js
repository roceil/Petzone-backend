const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: Array,
    },
    photos: {
      type: Array,
    },
    content: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    likes: {
      type: Array,
    },
    comments: {
      type: Array,
    },
    // createAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updateAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Post', postSchema)
