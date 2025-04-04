const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  // UserData
  tgId: {type: String, required: true, unique: true},
  userName: {type: String, required: false},
  imageUrl: {type: String, required: false},
  // GameData
  game: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
  statistic: { type: mongoose.Schema.Types.ObjectId, ref: "Statistic" },
  // Document
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
})


module.exports = mongoose.model("User", userSchema);