const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  },
  points: {
    type: Number,
  },
  pointsRecord: {
    type: Array,
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
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
