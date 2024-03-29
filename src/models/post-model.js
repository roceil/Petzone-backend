const mongoose = require('mongoose')
const { tagsEnum } = require('../lib/enum')

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      enum: tagsEnum,
    },
    photos: {
      type: Array,
      required: true,
    },
    content: {
      type: String,
      // minLength: 3,
      maxLength: 255,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        isLiked: {
          type: Boolean,
        },
      },
    ],
    comments: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
        },
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
        },
        createAt: {
          type: Date,
          default: Date.now,
        },
        updateAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Post', postSchema)
