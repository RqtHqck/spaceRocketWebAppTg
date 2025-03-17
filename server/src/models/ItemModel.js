const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  basePrice: {type: Number, required: true},
  priceMultiplier: {type: Number, required: true},
  earnMultiplier: {type: Number, required: true},
  imageUrl: {type: String, required: true},
})

module.exports = mongoose.model("Item", ItemSchema);