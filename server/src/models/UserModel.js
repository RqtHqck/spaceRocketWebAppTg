const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  tgId: { type: String, required: true, unique: true },
  userName: { type: String, required: false },
  coins: { type: Number, default: 0 },
})

module.exports = mongoose.model("user", userSchema);