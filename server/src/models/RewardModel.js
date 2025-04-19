const mongoose = require('mongoose');

const RewardSchema = mongoose.Schema({
  title: {type: String, required: true},
  type: {type: String, required: true}, // coins, level, tap
  levelRequired: {type: Number, required: true},
  awardCoins: {type: Number, required: false},
  awardExp: {type: Number, required: false},
})

// Пример:
// Title: Получите 10 уровень
// LevelRequired: 10
// AwardCoins: 30M
// awardExp: 4000

module.exports = mongoose.model("Reward", RewardSchema);