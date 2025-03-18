const UserModel = require('../models/UserModel');
const ItemService = require('../services/ItemService');
const ApiError = require('@errors/ApiError');
const logger = require('../utils/logger');
const { Types } = require('mongoose');

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
        {new: true, upsert: true}
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


  static async addItem(userId, itemId, level = 1) {
    try {
      logger.info("UserService::addItem")
      const user = await this.findByUserId(userId);
      const dbItem = await ItemService.findById(itemId);
      console.log(itemId)
      // Пытаемся найти предмет в массиве item пользователя
      let existingItem = user.items.find(item => new Types.ObjectId(item.itemId).toString() === new Types.ObjectId(itemId).toString());

      if (!existingItem) {
        // Если нету такого предмета
        logger.info("Items isn't exists in user items")
        user.items.push({ itemId, level, price: dbItem.basePrice });
      } else {
        // Если объект есть, то увеличиваем уровень и стоимость
        logger.info("Item exists. Update")
        existingItem.level += 1;
        existingItem.price = Math.round(existingItem.price * dbItem.priceMultiplier); // Округляем цену
        // existingItem.earn += 1;
        existingItem.earn = Math.round(existingItem.earn * dbItem.earnMultiplier); // Округляем коины за клик
      }

      await user.save();
      return user;
    } catch (err) {
      throw ApiError.internalError("Ошибка при добавлении предмета в инвентарь пользователя", err);
    }
  }

}

module.exports = UserService;