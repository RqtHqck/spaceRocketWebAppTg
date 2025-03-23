const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  // UserData
  tgId: {type: String, required: true, unique: true},
  userName: {type: String, required: false},
  imageUrl: {type: String, required: false},
  // GameData
  game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", unique: true },
  statistics: { type: mongoose.Schema.Types.ObjectId, ref: "Statistics", unique: true },
  // Document
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
})

// userSchema.pre('remove', async function(next) {
//   await GameModel.deleteOne({ _id: this.game });
//   await StatisticsModel.deleteOne({_id: this.statistics});
//   next();
// });



module.exports = mongoose.model("User", userSchema);