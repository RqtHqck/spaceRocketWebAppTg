const logger = require('../utils/logger');
const UserService = require('../services/UserService');

class UserController {
  static async findAll(req, res, next) {
    try {
      logger.info('UserController::findAll')
      const user = await UserService.findAll();
      res
        .status(200)
        .json(user);
    } catch (err) {
      next(err)
    }
  }


  static async findByUserId(req, res, next) {
    try {
      logger.info('UserController::findByUserId')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const user = await UserService.findByUserId(userId);
      res
        .status(200)
        .json(user);
    } catch (err) {
      next(err)
    }
  }


  static async findByTgId(req, res, next) {
    try {
      logger.info('UserController::findByTgId')
      const tgId = req.params.tgId.toString();
      logger.info(`Query param: { tgId:${tgId} }`)
      const user = await UserService.findByTgId(tgId);
      res
        .status(200)
        .json(user);
    } catch (err) {
      next(err)
    }
  }

  static async create(req, res, next) {
    try {
      const userDto = req.body
      logger.info('UserController::create')
      const coinsAmount = await UserService.create(userDto);
      res
        .status(201)
        .json(coinsAmount);
    } catch (err) {
      next(err)
    }
  }


  static async incrementCoins(req, res, next) {
    try {
      logger.info('UserController::incrementCoins')
      const { userId, amount } = req.body
      logger.info(`Body: { userId:${userId}, amount:${amount} }`)
      const updatedUserCoins = await UserService.incrementCoins(userId, amount);
      res
        .status(200)
        .json(updatedUserCoins);
    } catch (err) {
      next(err)
    }
  }


  static async getCoins(req, res, next) {
    try {
      logger.info('UserController::getCoins')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const coins = await UserService.getCoins(userId);
      res
        .status(200)
        .json({coins});
    } catch (err) {
      next(err)
    }
  }


  static async getUserItems(req, res, next) {
    try {
      logger.info('UserController::getUserItems')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const items = await UserService.getUserItems(userId);
      res
        .status(200)
        .json({items});
    } catch (err) {
      next(err)
    }
  }


  static async buyItem(req, res, next) {
    try {
      logger.info('UserController::addItem')
      const { userId, itemId } = req.body;
      logger.info(`Query param: { userId:${userId}, itemId:${itemId}`)
      const transaction = await UserService.processTransaction(userId, itemId);
      res
        .status(201)
        .json(transaction);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController;