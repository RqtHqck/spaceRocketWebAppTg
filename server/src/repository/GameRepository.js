const logger = require('@utils/logger');
const GameModel = require('@models/GameModel');
const ApiError = require('@errors/ApiError');


class GameRepository {

  static async findByUserId(userId) {
    try {
      logger.info("GameService::findByUserId")
      const game = await GameModel.findOne({userId}).populate([
        {
          path: 'unlockedPlanets.planetId',
          model: 'Planet' // Убедитесь, что модель Planet зарегистрирована
        },
        {
          path: 'items.itemId',
          model: 'Item' // Убедитесь, что модель Item зарегистрирована
        }
      ]);
      if (!game) throw ApiError.databaseError(400, `Not found game with userId: ${userId}`)
      return game
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error get game with userId: ${userId} from database`, err);
      }
    }
  }


  static async create(gameDto) {
    try {
      logger.info(`GameService::create dto: ${JSON.stringify(gameDto)}`);
      return  await GameModel.create(gameDto);
    } catch (err) {
      throw ApiError.databaseError(500, `Error when creating game document`, err);
    }
  }


  static async getUserItems(userId) {
    try {
      logger.info("GameService::getUserItems")
      const game = await GameModel.findOne({ userId }).populate([
        {
          path: 'items.itemId',
          model: 'Item' // Убедитесь, что модель Item зарегистрирована
        }
      ]);
      if (!game) throw ApiError.databaseError(404, `Error get game with userId: ${userId}`);
      return game.items;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error get items array for user with userId: ${userId}`, err);
      }
    }
  }


  static async getUserPlanets(userId) {
    try {
      logger.info("GameService::getUserPlanets");

      const game = await GameModel.findOne({ userId }).populate([
        {
          path: 'unlockedPlanets.planetId',
          model: 'Planet',
        },
      ]);
      console.log('Populated game:', game); // Добавьте это для отладки

      if (!game) throw ApiError.databaseError(404, `Error get game with userId: ${userId}`);
      return game.unlockedPlanets
      // return {
      //   current: game.currentPlanet,
      //   unlockedPlanets: game.unlockedPlanets
      // };
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error get planets array for user with userId: ${userId}`, err);
      }
    }
  }


  static async getLevel(userId) {
    try {
      logger.info("GameService::getLevel");
      const game = await this.findByUserId(userId);
      if (!game) throw ApiError.databaseError(404, `Error get game with userId: ${userId}`);
      return game.level;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error get coins for user with userId: ${userId}`, err);
      }
    }
  }


  static async getCoins(userId) {
    try {
      logger.info("GameService::getCoins");
      const game = await this.findByUserId(userId);
      if (!game) throw ApiError.databaseError(404, `Error get game with userId: ${userId}`);
      return game.coins;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error get coins for user with userId: ${userId}`, err);
      }
    }
  }


  static async addCoins(userId, amount) {
    logger.info("GameService::addCoins")
    return GameModel.findOneAndUpdate(
      {userId},
      {
        $inc: {
          coins: 1 + amount
        },
      },
      {new: true} // return update
    );
  }


  static async addExp(userId, amount) {
    logger.info("GameService::addExp")
    return GameModel.findOneAndUpdate(
      {userId},
      {
        $inc: {
          exp: amount
        },
      },
      { new: true }
    );
  }


  static async addLevel(userId, level=1, expToSubtract) {
    logger.info("GameRepository::addLevel")
    return GameModel.findOneAndUpdate(
      { userId: userId },
      {
        $inc: { level: level, exp: -expToSubtract },
      },
      { new: true } // Возвращает обновленный объект
    );
  }

}

module.exports = GameRepository;
