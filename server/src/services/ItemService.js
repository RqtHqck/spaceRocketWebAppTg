const ItemModel = require('../models/ItemModel')
const ApiError = require('@errors/ApiError')
const logger = require('../utils/logger');


class ItemService {

  static async findAll() {
    try {
      logger.info("ItemService::findAll")
      return await ItemModel.find().populate("updatesInventory.itemId");
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении предметов", err);
    }
  }


  // static async findById(tgId) {
  //   try {
  //     logger.info("ItemService::findById")
  //     return await ItemModel.findOne({tgId});
  //   } catch (err) {
  //     throw ApiError.internalError("Ошибка при получении предмета", err);
  //   }
  // }


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
