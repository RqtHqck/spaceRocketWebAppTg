const UserModel = require('../models/UserModel')
const ApiError = require('@errors/ApiError')
const logger = require('../utils/logger');


class UserService {

  static async findAll() {
    try {
      logger.info("UserModel::findAll")
      return await UserModel.find();
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении пользователей", err);
    }
  }


  static async findById(tgId) {
    try {
      logger.info("UserModel::findById")
      return await UserModel.findOne({tgId});
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении пользователя", err);
    }
  }


  static async create(userDto) {
    try {
      logger.info("UserModel::create: " + JSON.stringify(userDto));
      return await UserModel.create(userDto);
    } catch (err) {
      throw ApiError.internalError(`Error when creating user`, err);
    }
  }


  static async incrementCoins({ tgId, amount }) {
    try {
      logger.info("UserModel::incrementCoins")
      return await UserModel.findOneAndUpdate(
        {tgId},
        {$inc: {coins: amount}},
        {new: true, upsert: true}
      );
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении пользователя", err);
    }
  }
}

module.exports = UserService;