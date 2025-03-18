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


  static async findById(req, res, next) {
    try {
      logger.info('UserController::findById')
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
      const { userId, amount } = req.body
      logger.info(`Body: { userId:${userId}, amount:${amount} }`)
      logger.info('UserController::incrementCoins')
      const updatedUser = await UserService.incrementCoins(userId, amount);
      res
        .status(200)
        .json(updatedUser);
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
        .json(coins);
    } catch (err) {
      next(err)
    }
  }


  static async getUserItems(req, res, next) {
    try {
      logger.info('UserController::getUserUpdatesInventory')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const coins = await UserService.getUserItems(userId);
      res
        .status(200)
        .json(coins);
    } catch (err) {
      next(err)
    }
  }


  static async addItem(req, res, next) {
    try {
      logger.info('UserController::addItemToUser')
      const { userId, itemId } = req.body;
      logger.info(`Query param: { userId:${userId}, itemId:${itemId}`)
      const coins = await UserService.addItem(userId, itemId);
      res
        .status(200)
        .json(coins);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController;