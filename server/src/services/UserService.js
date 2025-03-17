const UserModel = require('../models/UserModel');
const ItemService = require('../services/ItemService');
const ApiError = require('@errors/ApiError');
const logger = require('../utils/logger');


class UserService {

  static async findAll() {
    try {
      logger.info("UserService::findAll")
      return await UserModel.find().populate("updatesInventory.itemId");
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении пользователей", err);
    }
  }


  static async findById(tgId) {
    try {
      logger.info("UserService::findById")
      return await UserModel.findOne({tgId}).populate("updatesInventory.itemId");;
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


  static async incrementCoins({ tgId, amount }) {
    try {
      logger.info("UserService::incrementCoins")
      return await UserModel.findOneAndUpdate(
        {tgId},
        {$inc: {coins: amount}},
        {new: true, upsert: true}
      );
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении пользователя", err);
    }
  }


  static async getCoins(tgId) {
    try {
      logger.info("UserService::getCoins")
      return await UserModel.findOne({ tgId }, { coins: 1 })

    } catch (err) {
      throw ApiError.internalError("Ошибка при получении пользователя", err);
    }
  }


  static async getUserItems(tgId) {
    try {
      logger.info("UserService::getUserItems")
      return await UserModel.findOne({ tgId }, { items: 1 }).populate("items.itemId");
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении инвентаря пользователя", err);
    }
  }


  static async addItem({ tgId, itemId, level = 1, price = 20}) {
    try {
      logger.info("UserService::addItem")
      const user = await UserModel.findOne({ tgId })
      if (!user) {
        throw new Error("Пользователь не найден");
      }

      // Пытаемся найти предмет в массиве item
      let existingItem = user.items.find(item => item.itemId.toString() === itemId.toString());

      if (!existingItem) {
        // Если нету такого предмета
        user.items.push({ itemId, level, price });
      } else {
        // Если объект есть, то увеличиваем уровень и стоимость
        const dbItem = await ItemService.findById(itemId);
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