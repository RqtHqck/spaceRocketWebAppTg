const mongoose = require('mongoose');

const PlanetSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  imageUrl: {type: String, required: true},
  requiredLevel: {type: Number, required: true},
  unlockCost: {type: Number, required: true},
  incomeUpdateAmount: {type: Number, default: 1},
  index: {type: Number, default: 0, required: true},
  createdAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model("Planet", PlanetSchema);