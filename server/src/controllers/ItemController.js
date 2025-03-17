const logger = require('../utils/logger');
const ItemService = require('../services/ItemService');

class ItemController {
  static async findAll(req, res, next) {
    try {
      logger.info('ItemController::findAll')
      const items = await ItemService.findAll();
      res
        .status(200)
        .json(items);
    } catch (err) {
      next(err)
    }
  }


  // static async findById(req, res, next) {
  //   try {
  //     logger.info('ItemController::findById')
  //     const tgId = req.query.tgId;
  //     logger.info(`Query param: { tgId:${tgId} }`)
  //     const user = await ItemService.findById(tgId);
  //     res
  //       .status(200)
  //       .json(user);
  //   } catch (err) {
  //     next(err)
  //   }
  // }


  static async create(req, res, next) {
    try {
      const itemDto = req.body
      logger.info('ItemController::create')
      const newItem = await ItemService.create(itemDto);
      res
        .status(201)
        .json(newItem);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ItemController;