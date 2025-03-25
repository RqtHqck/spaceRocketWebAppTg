const ItemModel = require('@models/ItemModel')
const ApiError = require('@errors/ApiError')
const logger = require('@utils/logger');


class ItemRepository {

  static async findAll() {
    try {
      logger.info("ItemRepository::findAll")
      return await ItemModel.find()
    } catch (err) {
      throw ApiError.databaseError(500,"Error find items", err);
    }
  }


  static async findById(itemId) {
    try {
      logger.info("ItemRepository::findById")
      return await ItemModel.findById(itemId);
    } catch (err) {
      throw ApiError.databaseError(500, "Error find items", err);
    }
  }


  static async create(itemDto) {
    try {
      logger.info("ItemRepository::create: " + JSON.stringify(itemDto));
      return await ItemModel.create(itemDto);
    } catch (err) {
      throw ApiError.databaseError(500, `Error create item`, err);
    }
  }


  static async createMany(itemDtos) {
    try {
      logger.info("ItemRepository::create: " + JSON.stringify(itemDtos));
      return await ItemModel.insertMany(itemDtos, {ordered: true});
    } catch (err) {
      throw ApiError.databaseError(500, `Error create items`, err);
    }
  }

}

module.exports = ItemRepository;
