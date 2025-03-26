const logger = require('@utils/logger');
const GameService = require('@services/GameService');
const GameRepository = require('@repository/GameRepository');


class GameController {

  static async findByUserId(req, res, next) {
    try {
      logger.info('GameController::findByUserId')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const game = await GameRepository.findByUserId(userId);
      res
        .status(200)
        .json(game);
    } catch (err) {
      next(err)
    }
  }


  static async getCoins(req, res, next) {
    try {
      logger.info('GameController::getCoins')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const coins = await GameRepository.getCoins(userId);
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
      const game = await GameService.incrementCoins(userId, amount);
      res
        .status(200)
        .json(game);
    } catch (err) {
      next(err)
    }
  }


  static async getItems(req, res, next) {
    try {
      logger.info('GameController::getUserItems')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const items = await GameRepository.getItems(userId);
      res
        .status(200)
        .json({items});
    } catch (err) {
      next(err)
    }
  }


  static async buyItem(req, res, next) {
    try {
      logger.info('GameController::buyItem')
      const { userId, itemId } = req.body;
      logger.info(`Query param: { userId:${userId}, itemId:${itemId}`)
      const transaction = await GameService.processPurchaseItem(userId, itemId);
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
      const transaction = await GameService.processPurchaseItem(userId, itemId);
      res
        .status(201)
        .json(transaction);
    } catch (err) {
      next(err)
    }
  }


  static async buyPlanet(req, res, next) {
    try {
      logger.info('GameController::buyPlanet')
      const { userId, planetId } = req.body;
      logger.info(`Query param: { userId:${userId}, planetId:${planetId}`)
      const transaction = await GameService.processPurchasePlanet(userId, planetId);
      res
        .status(201)
        .json(transaction);
    } catch (err) {
      next(err)
    }
  }


  static async incrementLevel(req, res, next) {
    try {
      logger.info('GameController::addLevel')
      const { userId, amount } = req.body;
      logger.info(`Body param: { userId:${userId}, amount:${amount}`)
      const game = await GameService.addExp(userId, amount);
      res
        .status(201)
        .json(game);
    } catch (err) {
      next(err)
    }

  }

}

module.exports = GameController;