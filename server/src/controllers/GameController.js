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


  static async getLevel(req, res, next) {
    try {
      logger.info('GameController::getLevel')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const level = await GameRepository.getLevel(userId);
      res
        .status(200)
        .json({level});
    } catch (err) {
      next(err)
    }
  }


  static async getCurrentPlanetIndex(req, res, next) {
    try {
      logger.info('GameController::getCurrentPlanetIndex')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const currentPlanetIndex = await GameRepository.getCurrentPlanetIndex(userId);
      res
        .status(200)
        .json({currentPlanetIndex});
    } catch (err) {
      next(err)
    }
  }


  static async incrementCoins(req, res, next) {
    try {
      logger.info('GameController::incrementCoins')
      const { userId, amount } = req.body;
      logger.info(`Query param: { userId:${userId}, amount:${amount} }`)
      const game = await GameService.incrementCoins(userId, amount);
      res
        .status(200)
        .json(game);
    } catch (err) {
      next(err)
    }
  }


  static async getUserItems(req, res, next) {
    try {
      logger.info('GameController::getUserItems')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const items = await GameRepository.getUserItems(userId);
      res
        .status(200)
        .json({items});
    } catch (err) {
      next(err)
    }
  }


  static async getUserPlanets(req, res, next) {
    try {
      logger.info('GameController::getUserPlanets')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const planetsData = await GameRepository.getUserPlanets(userId);
      res
        .status(200)
        .json(planetsData);
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
      logger.info('GameController::incrementLevel')
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