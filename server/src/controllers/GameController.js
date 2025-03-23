const logger = require('../utils/logger');
const GameService = require('../services/GameService');


class GameController {

  static async findByUserId(req, res, next) {
    try {
      logger.info('GameController::findByUserId')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const game = await GameService.findByUserId(userId);
      res
        .status(200)
        .json(game);
    } catch (err) {
      next(err)
    }
  }

  // Coins handlers
  static async getCoins(req, res, next) {
    try {
      logger.info('GameController::getCoins')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const coins = await GameService.getCoins(userId);
      res
        .status(200)
        .json({coins});
    } catch (err) {
      next(err)
    }
  }


  static async incrementCoins(req, res, next) {
    try {
      logger.info('GameController::incrementCoins')
      const { userId, amount} = req.body;
      logger.info(`Query param: { userId:${userId}, amount:${amount} }`)
      const coins = await GameService.incrementCoins(userId, amount);
      res
        .status(200)
        .json(coins);
    } catch (err) {
      next(err)
    }
  }

  // Items handlers
  static async getItems(req, res, next) {
    try {
      logger.info('GameController::getUserItems')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const items = await GameService.getItems(userId);
      res
        .status(200)
        .json({items});
    } catch (err) {
      next(err)
    }
  }

  // ------------------- Purchase handlers
  static async buyItem(req, res, next) {
    try {
      logger.info('GameController::buyItem')
      const { userId, itemId } = req.body;
      logger.info(`Query param: { userId:${userId}, itemId:${itemId}`)
      const transaction = await GameService.processPurchase(userId, itemId);
      res
        .status(201)
        .json(transaction);
    } catch (err) {
      next(err)
    }
  }


  static async upgradeItem(req, res, next) {
    try {
      logger.info('GameController::upgradeItem')
      const { userId, itemId } = req.body;
      logger.info(`Query param: { userId:${userId}, itemId:${itemId}`)
      const transaction = await GameService.processPurchase(userId, itemId);
      res
        .status(201)
        .json(transaction);
    } catch (err) {
      next(err)
    }
  }

}

module.exports = GameController;