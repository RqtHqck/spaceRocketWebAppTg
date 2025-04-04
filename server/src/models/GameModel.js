const mongoose = require('mongoose');
const ExperienceService = require('@services/ExperienceService');
const logger = require('@utils/logger');

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
  logger.info(`GameSchema::calculateExpGain`)

  return this.items.reduce((totalIncome, item) => {
    return totalIncome + item.income;
  }, 0);
};

// Метод для подсчёта полученного опыта с действия
gameSchema.methods.calculateExpGain = function(actionType) {
  logger.info(`GameSchema::calculateExpGain actionType:${actionType}`)
  let amount;
  const userLevel = this.level;
  switch (actionType) {
    case "updateItem":
      amount = ExperienceService.getUpdateItemExp(userLevel);
      break;
    case "unlockPlanet":
      amount = ExperienceService.getPlanetUnlockingExp(userLevel);
      break;
    case "purchaseItem":
      amount = ExperienceService.getPurchaseItemExp(userLevel);
      break;
    case "click":
      amount = ExperienceService.getClickExp(userLevel);
      break;
    default:
      throw new Error("Invalid action type");
  }
  return amount;
}


gameSchema.virtual("expRequired").get(function() {
  const total = ExperienceService.getRequiredExp(this.level);
  const toNext = total - this.exp;
  logger.info(`Current level: ${this.level}, exp: ${this.exp}, total: ${total}, toNext: ${toNext}`);

  return {
    total,
    toNext
  };
})

gameSchema.set("toJSON", { virtuals: true });


module.exports = mongoose.model("Game", gameSchema);


