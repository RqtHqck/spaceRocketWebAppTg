const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  tgId: {type: String, required: true, unique: true},
  userName: {type: String, required: false},
  imageUrl: {type: String, required: false},
  coins: {type: Number, default: 0, required: false},
  level: {type: Number, default: 0, required: false},
  score: {type: Number, default: 0, required: false},
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      level: {type: Number, default: 0, required: false},
      price: {type: Number, default: 0, required: false},
    }
  ],
})

module.exports = mongoose.model("User", userSchema);