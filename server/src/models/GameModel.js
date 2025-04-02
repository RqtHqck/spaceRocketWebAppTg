const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  // Profile
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  coins: {type: Number, default: 0},
  level: {type: Number, default: 0},
  exp: {type: Number, default: 0, required: false},
  // Planets
  unlockedPlanets: [
    {
      planetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Planet' },
      unlockedAt: { type: Date, default: Date.now }
    }
  ],
  currentPlanetIndex: { type: Number, default: 0 },
  // Items
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      level: {type: Number, default: 0, required: false},
      upgradePrice: {type: Number, default: 0, required: false},
      income: {type: Number, default: 1, required: false},
      boughtAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }
  ],
})

gameSchema.index({ userId: 1 }, { unique: true });

// Метод для подсчета общего дохода всех items
gameSchema.methods.calculateTotalIncome = function() {
  return this.items.reduce((totalIncome, item) => {
    return totalIncome + item.income;
  }, 0);
};


module.exports = mongoose.model("Game", gameSchema);