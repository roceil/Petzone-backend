const mongoose = require("mongoose");
const { Schema } = mongoose;

function category(val) {
  const categoryList = {
    1: { type: "dog", name: "狗狗主食" },
    2: { type: "dog", name: "狗狗零食" },
    3: { type: "dog", name: "貓貓主食" },
    4: { type: "cat", name: "貓貓零食" },
    5: { type: "cat", name: "貓砂系列" },
    6: { type: "all", name: "保健系列" },
    7: { type: "all", name: "沐浴 & 清潔" },
    8: { type: "all", name: "生活用品 & 玩具" },
  };

  if (categoryList.hasOwnProperty(val)) {
    return categoryList[val];
  } else {
    return null;
  }
}

const productSchema = new Schema({
  name: { type: String, required: true },
  category: {
    type: Object,
    set: category,
  },
  photos: { type: Array, default: [] },
  originPrice: { type: Number, required: true },
  price: { type: Number },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  description: { type: String },
  isEnabled: { type: Boolean, default: false },
  review: { type: Array, default: [] },
  createAt: { type: Number },
  updateAt: { type: Number },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
