const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  basePrice: {type: Number, required: true}, // start price
  priceMultiplier: {type: Number, required: true}, // coefficient for price multiplying after each level incremention
  earnMultiplier: {type: Number, required: true}, // coefficient
  imageUrl: {type: String, required: true},
})

module.exports = mongoose.model("Item", ItemSchema);