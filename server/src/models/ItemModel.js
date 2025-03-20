const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  basePrice: {type: Number, required: true}, // start price
  baseIncome: {type: Number, required: true},
  priceMultiplier: {type: Number, required: true}, // coefficient for price multiplying after each level incremention
  incomeMultiplier: {type: Number, required: true}, // coefficient for income multiplying after each level incremention
  imageUrl: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model("Item", ItemSchema);