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
      return await UserModel.find().populate("items.itemId");
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении пользователей", err);
    }
  }


  static async findByUserId(userId) {
    try {
      logger.info("UserService::findByUserId")
      return await UserModel.findById(userId).populate("items.itemId");
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении пользователя", err);
    }
  }


  static async findByTgId(tgId) {
    try {
      logger.info("UserService::findByTgId")
      return await UserModel.findOne({tgId});
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении пользователя", err);
    }
  }

  static async create(userDto) {
    try {
      logger.info("UserService::create: " + JSON.stringify(userDto));
      return await UserModel.create(userDto);
    } catch (err) {
      throw ApiError.internalError(`Error when creating user`, err);
    }
  }


  static async incrementCoins(userId) {
    try {
      logger.info("UserService::incrementCoins")
      return await UserModel.findOneAndUpdate(
        {_id: userId},
        {$inc: {coins: 1}},
        {new: true}
      );
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении пользователя", err);
    }
  }


  static async getCoins(userId) {
    try {
      logger.info("UserService::getCoins")
      return await UserModel.findOne({ _id: userId }, { coins: 1 })

    } catch (err) {
      throw ApiError.internalError("Ошибка при получении пользователя", err);
    }
  }


  static async getUserItems(userId) {
    try {
      logger.info("UserService::getUserItems")
      return await UserModel.findOne({ _id: userId }, { items: 1 }).populate("items.itemId");
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении инвентаря пользователя", err);
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

      logger.info("Транзакция успешно завершена");
      return res
    } catch (err) {
      throw ApiError.internalError('Ошибка в ходе processTransaction', err)
    }
  }


  static async upgradeItem(user, existingItem, dbItem) {
    try {
      logger.info("UserService::upgradeItem")

      // Списываем коины
      if (user.coins < existingItem.upgradePrice) {
        throw new Error('Недостаточно коинов');
      }
      user.coins -= existingItem.upgradePrice;

      // Логика upgrade
      existingItem.level += 1;
      existingItem.upgradePrice = Math.round(existingItem.upgradePrice * dbItem.priceMultiplier);
      existingItem.income = Math.round(existingItem.income * dbItem.incomeMultiplier);

      await user.save();

      const transactionDto = {
        userId: user._id,
        itemId: dbItem._id,
        type: 'purchase:itemUpgrade',
        amount: -existingItem.upgradePrice,
        userBalance: user.coins
      }
      const transaction = await TransactionService.create(transactionDto);
      logger.info("Item bought successfully");

      return transaction;
    } catch (err) {
      throw ApiError.internalError(`Ошибка при покупки предмета ${dbItem._id}`, err);
    }
  }


  static async buyItem(user, dbItem) {
    try{
      logger.info("UserService::buyItem")

      // Списываем коины
      if (user.coins < dbItem.basePrice) {
        throw new Error('Недостаточно коинов');
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
      throw ApiError.internalError(`Ошибка при покупки предмета ${dbItem._id}`, err);
  }
}
}

module.exports = UserService;