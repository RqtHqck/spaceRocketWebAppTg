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
      upgradePrice: {type: Number, default: 0, required: false},
      income: {type: Number, default: 2, required: false},
    }
  ],
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
})

// Метод для подсчета общего дохода всех items
userSchema.methods.calculateTotalIncome = function() {
  return this.items.reduce((totalIncome, item) => {
    return totalIncome + item.income;
  }, 0);
};


module.exports = mongoose.model("User", userSchema);