const UserModel = require('../models/UserModel');
const ItemService = require('../services/ItemService');
const TransactionService = require('../services/TransactionService');
const ApiError = require('@errors/ApiError');
const logger = require('../utils/logger');
const { Types } = require('mongoose');
const mongoose = require('mongoose');

class UserService {

  static async findAll() {
    try {
      logger.info("UserService::findAll")
      const users = await UserModel.find().populate("items.itemId");
      if (!users) return [];
      return users;
    } catch (err) {
      throw ApiError.databaseError(404, "Error when found all users", err);
    }
  }


  static async findByUserId(userId) {
    try {
      logger.info("UserService::findByUserId")
      const user = await UserModel.findById(userId).populate("items.itemId");
      if (!user) throw ApiError.databaseError(404, `Not found user with userId: ${userId}`)
      return user
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(404, `Error get user with userId: ${userId} from database`, err);
      }
    }
  }


  static async findByTgId(tgId) {
    try {
      logger.info("UserService::findByTgId")
      const user = await UserModel.findOne({tgId}).populate("items.itemId");
      if (!user) throw ApiError.databaseError(404, `Not found user with tgId: ${tgId}`)
      return user
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(404, `Error get user with tgId: ${tgId} from database`, err);
      }
    }
  }

  static async create(userDto) {
    try {
      logger.info("UserService::create: " + JSON.stringify(userDto));
      return await UserModel.create(userDto);
    } catch (err) {
      throw ApiError.databaseError(500, `Error when creating user`, err);
    }
  }


  static async calculateCoinsIncrementValue(userId) {
    try {
      logger.info("UserService::calculateCoinsIncrement")
      const user = await UserService.findByUserId(userId);
      if (!user) throw ApiError.databaseError()
      return user.calculateTotalIncome();
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
      logger.info("UserService::incrementCoins")
      const totalIncome = await this.calculateCoinsIncrementValue(userId);
      return await UserModel.findOneAndUpdate(
        {_id: userId},
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
        throw ApiError.databaseError(`Error increment coins for user with userId: ${userId}`, err);
      }
    }
  }


  static async getCoins(userId) {
    try {
      logger.info("UserService::getCoins");
      const user = await this.findByUserId(userId);
      return user.coins;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(`Error get coins for user with userId: ${userId}`, err);
      }
    }
  }


  static async getUserItems(userId) {
    try {
      logger.info("UserService::getUserItems")
      const user = await this.findByUserId(userId)
      return user.items;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error get items array for user with userId: ${userId}`, err);
      }
    }
  }


  static async processTransaction(userId, itemId) {
    logger.info("UserService::processTransaction")

    const user = await this.findByUserId(userId);
    const dbItem = await ItemService.findById(itemId);

    // Пытаемся найти предмет в массиве item пользователя
    let existingItem = user.items.find(item => new Types.ObjectId(item.itemId).toString() === new Types.ObjectId(itemId).toString());

    try {
      let res;
      if (!existingItem) {
        // Если нету такого предмета, то покупаем
        logger.info("Items isn't exists in user items")
        res = await this.buyItem(user, dbItem);
      } else {
        // Если объект есть, то обновляем
        logger.info("Item exists. Update")
        res = await this.upgradeItem(user, existingItem, dbItem);
      }

      logger.info("Transaction successful!");
      return res
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.transactionError('Error during processTransaction', err)
      }
    }
  }



  static async upgradeItem(user, existingItem, dbItem) {
    try {
      logger.info("UserService::upgradeItem")

      // Списываем коины
      if (user.coins < existingItem.upgradePrice) {
        throw ApiError.userError(400, 'You have not enough coins!');
      }
      user.coins -= existingItem.upgradePrice;

      // Логика upgrade
      existingItem.level += 1;
      existingItem.upgradePrice = Math.round(existingItem.upgradePrice * dbItem.priceMultiplier);
      existingItem.income = Math.round(existingItem.income * dbItem.incomeMultiplier);

      const transactionDto = {
        userId: user._id,
        itemId: dbItem._id,
        type: 'purchase:itemUpgrade',
        amount: -existingItem.upgradePrice,
        userBalance: user.coins
      }

      const transaction = await TransactionService.create(transactionDto);
      await user.save();

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


  static async buyItem(user, dbItem) {
    try{
      logger.info("UserService::buyItem")

      // Списываем коины
      if (user.coins < dbItem.basePrice) {
        throw ApiError.userError(400, 'You have not enough coins!');
      }
      user.coins -= dbItem.basePrice;
      user.items.push({
        itemId: dbItem._id,
        level: 1,
        upgradePrice: dbItem.basePrice * dbItem.priceMultiplier,
        income: dbItem.baseIncome
      });
      await user.save();

      const transactionDto = {
        userId: user._id,
        itemId: dbItem._id,
        type: 'purchase:itemPurchase',
        amount: -dbItem.basePrice,
        userBalance: user.coins
      }
      const transaction = await TransactionService.create(transactionDto);

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

module.exports = UserService;