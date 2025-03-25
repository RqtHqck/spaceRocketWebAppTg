const ApiError = require('@errors/ApiError');
const logger = require('@utils/logger');
const UserModel = require('@models/UserModel');


class UserRepository {

  static async findAll() {
    try {
      logger.info("UserRepository::findAll")
      const users = await UserModel.find()
        .populate({
          path: 'game',
          populate: [
            {
              path: 'unlockedPlanets.planet',
              model: 'Planet' // Убедитесь, что модель Planet зарегистрирована
            },
            {
              path: 'currentPlanet',
              model: 'Planet'
            },
            {
              path: 'items.itemId',
              model: 'Item' // Убедитесь, что модель Item зарегистрирована
            }
          ]
        })
        .populate({
          path: 'statistic',
          model: 'Statistic'
        })
      if (!users) return [];
      return users;
    } catch (err) {
      throw ApiError.databaseError(500, "Error when found all users", err);
    }
  }


  static async findByUserId(userId) {
    try {
      logger.info("UserRepository::findByUserId")
      const user = await UserModel.findById(userId).populate({
        path: 'game',
        populate: [
          {
            path: 'unlockedPlanets.planet',
            model: 'Planet' // Убедитесь, что модель Planet зарегистрирована
          },
          {
            path: 'currentPlanet',
            model: 'Planet'
          },
          {
            path: 'items.itemId',
            model: 'Item' // Убедитесь, что модель Item зарегистрирована
          }
        ]
      })
        .populate({
          path: 'statistic',
          model: 'Statistic'
        })
      return user
    } catch (err) {
      throw ApiError.databaseError(500, `Error get user with userId: ${userId} from database`, err);
    }
  }


  static async findByTgId(tgId) {
    try {
      logger.info("UserRepository::findByTgId")
      const user = await UserModel.findOne({tgId}).populate({
        path: 'game',
        populate: [
          {
            path: 'unlockedPlanets.planet',
            model: 'Planet' // Убедитесь, что модель Planet зарегистрирована
          },
          {
            path: 'currentPlanet',
            model: 'Planet'
          },
          {
            path: 'items.itemId',
            model: 'Item' // Убедитесь, что модель Item зарегистрирована
          }
        ]
      })
        .populate({
          path: 'statistic',
          model: 'Statistic'
        })
      return user
    } catch (err) {
      throw ApiError.databaseError(500, `Error get user with tgId: ${tgId} from database`, err);
    }
  }


  static async create(userDto) {
    try {
      logger.info("UserRepository::create");
      return await UserModel.create(userDto);
    } catch (err) {
      throw ApiError.databaseError(500, `Error when creating user`, err);
    }
  }

}

module.exports = UserRepository;