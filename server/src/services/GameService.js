const logger = require('../utils/logger');
const ApiError = require('../errors/ApiError');
const GameModel = require('../models/GameModel');
const TransactionService = require('./TransactionService');
const ItemService = require('./ItemService');
const {Types} = require('mongoose');


class GameService {

  // CRUD handlers
  static async findByUserId(userId) {
    try {
      logger.info("GameService::findByUserId")
      const game = await GameModel.findOne({userId}).populate([
        {
          path: 'unlockedPlanets.planet',
          model: 'Planet' // Убедитесь, что модель Planet зарегистрирована
        },
        {
          path: 'currentPlanet',
          model: 'Planet'
        },
        {
          path: 'items.itemId',
          model: 'Item' // Убедитесь, что модель Item зарегистрирована
        }
      ]);
      if (!game) throw ApiError.databaseError(500, `Not found game with userId: ${userId}`)
      return game
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error get game with userId: ${userId} from database`, err);
      }
    }
  }


  static async create(gameDto) {
    try {
      logger.info(`GameService::create dto: ${JSON.stringify(gameDto)}`);
      return  await GameModel.create(gameDto);
    } catch (err) {
      throw ApiError.databaseError(500, `Error when creating game document`, err);
    }
  }


  static async getCoins(userId) {
    try {
      logger.info("GameService::getCoins");
      const game = await this.findByUserId(userId);
      return game.coins;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error get coins for user with userId: ${userId}`, err);
      }
    }
  }


  static async calculateCoinsIncrementValue(userId) {
    try {
      logger.info("GameService::calculateCoinsIncrement")
      const game = await this.findByUserId(userId);
      return game.calculateTotalIncome();
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.internalError(`Error when calculated coins increment value for user with userId: ${userId}`, err);
      }
    }
  }


  static async incrementCoins(userId, incomeAmountInc) {
    try {
      logger.info("GameService::incrementCoins")
      const totalIncome = await this.calculateCoinsIncrementValue(userId);
      return await GameModel.findOneAndUpdate(
        {userId},
        {$inc: {
            coins: 1 + totalIncome + (incomeAmountInc || 0)
          }
        },
        {new: true}
      );
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error increment coins for user with userId: ${userId}`, err);
      }
    }
  }


  static async getItems(userId) {
    try {
      logger.info("GameService::getItems")
      const game = await this.findByUserId(userId)
      return game.items;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error get items array for user with userId: ${userId}`, err);
      }
    }
  }


  static async processPurchase(userId, itemId) {
    logger.info("GameService::processTransaction")

    const game = await this.findByUserId(userId);
    const dbItem = await ItemService.findById(itemId);

    // Пытаемся найти предмет в массиве item пользователя
    let existingItem = game.items.find(item => new Types.ObjectId(item.itemId).toString() === new Types.ObjectId(itemId).toString());

    try {
      let res;
      if (!existingItem) {
        // Если нету такого предмета, то покупаем
        logger.info("Items isn't exists in user items")
        res = await this.buyItem(game, dbItem);
      } else {
        // Если объект есть, то обновляем
        logger.info("Item exists. Update")
        res = await this.upgradeItem(game, existingItem, dbItem);
      }

      logger.info("Transaction successful!");
      return res
    } catch (err) {
      throw ApiError.transactionError('Error during processTransaction', err)
    }
  }


  static async upgradeItem(game, existingItem, dbItem) {
    try {
      logger.info("GameService::upgradeItem")

      // Списываем коины
      if (game.coins < existingItem.upgradePrice) {
        throw ApiError.userError(400, 'You have not enough coins!');
      }
      game.coins -= existingItem.upgradePrice;

      // Логика upgrade
      existingItem.level += 1;
      existingItem.upgradePrice = Math.round(existingItem.upgradePrice * dbItem.priceMultiplier);
      existingItem.income = Math.round(existingItem.income * dbItem.incomeMultiplier);

      const transactionDto = {
        userId: game.userId,
        itemId: dbItem._id,
        type: 'purchase:itemUpgrade',
        amount: -existingItem.upgradePrice,
        userBalance: game.coins
      }

      const transaction = await TransactionService.create(transactionDto);
      await game.save();

      logger.info("Item upgrade successfully");
      return transaction;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.internalError(`Error upgrade item with id: ${dbItem._id}`, err);
      }
    }
  }


  static async buyItem(game, dbItem) {
    try{
      logger.info("GameService::buyItem")

      // Списываем коины
      if (game.coins < dbItem.basePrice) {
        throw ApiError.userError(400, 'You have not enough coins!');
      }
      game.coins -= dbItem.basePrice;
      game.items.push({
        itemId: dbItem._id,
        level: 1,
        upgradePrice: dbItem.basePrice * dbItem.priceMultiplier,
        income: dbItem.baseIncome
      });

      const transactionDto = {
        userId: game.userId,
        itemId: dbItem._id,
        type: 'purchase:itemPurchase',
        amount: -dbItem.basePrice,
        userBalance: game.coins
      }
      const transaction = await TransactionService.create(transactionDto);
      await game.save();

      logger.info("Item bought successfully");
      return transaction;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.internalError(`Error bought item with id: ${dbItem._id}`, err);
      }
    }
  }
}

module.exports = GameService;