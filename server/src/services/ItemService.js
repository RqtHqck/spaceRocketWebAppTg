const ItemModel = require('../models/ItemModel')
const UserService = require('../services/UserService')
const ApiError = require('@errors/ApiError')
const logger = require('../utils/logger');


class ItemService {

  static async findAll() {
    try {
      logger.info("ItemService::findAll")
      return await ItemModel.find()
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении предметов", err);
    }
  }


  static async findById(userTgId) {
    try {
      logger.info("ItemService::findById")
      const user = (await UserService.findById(userTgId));
      return user.items;
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении предмета", err);
    }
  }


  static async create(itemDto) {
    try {
      logger.info("ItemService::create: " + JSON.stringify(itemDto));
      return await ItemModel.create(itemDto);
    } catch (err) {
      throw ApiError.internalError(`Ошибка при создании предмета`, err);
    }
  }
}

module.exports = ItemService;
