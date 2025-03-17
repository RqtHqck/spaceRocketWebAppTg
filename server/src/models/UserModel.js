const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  tgId: {type: String, required: true, unique: true},
  userName: {type: String, required: false},
  coins: {type: Number, default: 0, required: false},
  updatesInventory: {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "item" },
    level: {type: Number, default: 0, required: true},
  },
  score: {type: Number, default: 0, required: false},
  level: {type: Number, default: 0, required: false},
})

module.exports = mongoose.model("user", userSchema);