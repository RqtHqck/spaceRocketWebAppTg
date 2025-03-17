const UserModel = require('../models/UserModel')
const ApiError = require('@errors/ApiError')
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

}

module.exports = UserService;