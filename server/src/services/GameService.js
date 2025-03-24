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


  static async incrementCoins(userId, amount) {
    try {
      logger.info("GameService::incrementCoins")
      // Find total game coins
      const game = await this.findByUserId(userId);
      const totalIncome = game.calculateTotalIncome() + (amount || 0);
      // Update coins
      const updatedGame = await this.addCoins(userId, totalIncome);
      // Add exp
      await this.incrementExp(userId, 5);

      return updatedGame
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error increment coins for user with userId: ${userId}`, err);
      }
    }
  }


  static async addCoins(userId, amount) {
    logger.info("GameService::addCoins")
    return GameModel.findOneAndUpdate(
      {userId},
      {
        $inc: {
          coins: 1 + amount
        },
      },
      {new: true} // return update
    );
  }


  static async incrementExp(userId, amount) {
    // Add exp and update level if need
    const updatedGame = await this.addExp(userId, amount);
    await this.updateLevel(updatedGame);
    return updatedGame;
  }


  static async addExp(userId, amount) {
    logger.info("GameService::addExp")
    return GameModel.findOneAndUpdate(
      {userId},
      {
        $inc: {
          exp: amount
        },
      },
      { new: true }
    );
  }


  static async updateLevel(playerGame) {
    let updatedGame = playerGame; // Хранит обновленный объект

    while (updatedGame.exp >= this.getRequiredExp(updatedGame.level)) {
      const requiredExp = this.getRequiredExp(updatedGame.level);

      // Вычитаем опыт и увеличиваем уровень
      updatedGame = await GameModel.findOneAndUpdate(
        { userId: updatedGame.userId },
        {
          $inc: { level: 1, exp: -requiredExp },
        },
        { new: true } // Возвращает обновленный объект
      );

      console.log(`Новый уровень: ${updatedGame.level}! Осталось опыта: ${updatedGame.exp}`);
    }
  }


  static getRequiredExp(level) {
    const baseExp = 100; // Базовое количество опыта для первого уровня
    const expMultiplier = 1.5; // Множитель для увеличения опыта
    return Math.floor(baseExp * Math.pow(expMultiplier, level - 1)); // Експоненциальный рост
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