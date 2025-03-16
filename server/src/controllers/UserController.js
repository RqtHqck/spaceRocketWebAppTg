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
      const tgId = req.query.tgId;
      logger.info(`Query param: { tgId:${tgId} }`)
      const user = await UserService.findById(tgId);
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
      const { tgId, amount } = req.body
      logger.info(`Body: { tgId:${tgId}, amount:${amount} }`)
      logger.info('UserController::incrementCoins')
      const updatedUser = await UserService.incrementCoins({ tgId, amount });
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
      const tgId = req.query.tgId;
      logger.info(`Query param: { tgId:${tgId} }`)
      const coins = await UserService.getCoins(tgId);
      res
        .status(200)
        .json(coins);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController;