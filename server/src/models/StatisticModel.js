const mongoose = require('mongoose');

const statisticSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  timeSpent: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
  totalClicks: { type: Number, default: 0 },
  transactionsCount: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
})



module.exports = mongoose.model("Statistic", statisticSchema);