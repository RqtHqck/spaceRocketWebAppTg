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
              path: 'unlockedPlanets.planetId',
              model: 'Planet' // Убедитесь, что модель Planet зарегистрирована
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
            path: 'unlockedPlanets.planetId',
            model: 'Planet' // Убедитесь, что модель Planet зарегистрирована
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
            path: 'unlockedPlanets.planetId',
            model: 'Planet' // Убедитесь, что модель Planet зарегистрирована
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


  static async findSorted() {
    try {
      logger.info(`UserRepository::findSorted`);
      return await UserModel
        .aggregate([
          {
            $match: {},
          },
          {
            $lookup: {
              from: "games", // имя коллекции в нижнем регистре и во множественном числе (как в монго compass)
              localField: "game", // поле в users
              foreignField: "_id", // поле в items
              as: "game" // новое поле с подтянутыми документами
            }
          },
          { $unwind: "$game" },
          {
            $lookup:
              {
                from: "statistics",
                localField: "statistic",
                foreignField: "_id",
                as: "statistic"
              }
          },
          {
            $addFields: {
              itemsAmount: {
                $cond: {
                  if: { $isArray: "$game.items" },
                  then: { $size: "$game.items" },
                  else: 0
                }
              }
            }
          },
          {
            $addFields: {
              planetsAmount: {
                $cond: {
                  if: { $isArray: "$game.unlockedPlanets" },
                  then: { $size: "$game.unlockedPlanets" },
                  else: 0
                }
              }
            }
          },
          {
            $sort: {
              'game.level': -1, 'game.exp': -1, 'game.coins': -1, planetsAmount: -1, itemsAmount: -1
            }
          },
        ])
    } catch (err) {
      throw ApiError.databaseError(500, `Error when found sorted user`, err);
    }
  }


  // static async findFiltered(filters) {
  //   try {
  //     logger.info(`UserRepository::findFiltered filters: ${JSON.stringify(filters)}`);
  //     // return await UserModel.find(filters);
  //     return await UserModel.find({}, {});
  //   } catch (err) {
  //     throw ApiError.databaseError(500, `Error when creating user`, err);
  //   }
  // }

}

module.exports = UserRepository;