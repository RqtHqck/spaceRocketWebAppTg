const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  itemId: {type: mongoose.Schema.Types.ObjectId, ref: "Item"},
  type: { type: String, required: true, enum: ['purchase:itemUpgrade', 'purchase:itemPurchase', 'reward', 'event'] },
  amount: {type: Number, required: true},
  userBalance: {type: Number, required: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model("Transaction", TransactionSchema);