const ItemModel = require('../models/ItemModel')
const ApiError = require('@errors/ApiError')
const logger = require('../utils/logger');


class ItemService {

  static async findAll() {
    try {
      logger.info("ItemService::findAll")
      return await ItemModel.find()
    } catch (err) {
      throw ApiError.databaseError(500,"Error find items", err);
    }
  }


  static async findById(itemId) {
    try {
      logger.info("ItemService::findById")
      return await ItemModel.findById(itemId);
    } catch (err) {
      throw ApiError.databaseError(500, "Error find items", err);
    }
  }


  static async create(itemDto) {
    try {
      logger.info("ItemService::create: " + JSON.stringify(itemDto));
      return await ItemModel.create(itemDto);
    } catch (err) {
      throw ApiError.databaseError(500, `Error create item`, err);
    }
  }


  static async createMany(itemDtos) {
    try {
      logger.info("ItemService::create: " + JSON.stringify(itemDtos));
      return await ItemModel.insertMany(itemDtos, {ordered: true});
    } catch (err) {
      throw ApiError.databaseError(500, `Error create items`, err);
    }
  }
}

module.exports = ItemService;
