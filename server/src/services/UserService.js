const ApiError = require('@errors/ApiError');
const logger = require('../utils/logger');
const { Types } = require('mongoose');

const UserModel = require('../models/UserModel');
const ItemService = require('../services/ItemService');
const TransactionService = require('../services/TransactionService');
const GameService = require('./GameService');
const StatisticsService = require('./StatisticsService');

class UserService {

  static async findAll() {
    try {
      logger.info("UserService::findAll")
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
          path: 'statistics',
          model: 'Statistics'
        })
      if (!users) return [];
      return users;
    } catch (err) {
      throw ApiError.databaseError(500, "Error when found all users", err);
    }
  }


  static async findByUserId(userId) {
    try {
      logger.info("UserService::findByUserId")
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
          path: 'statistics',
          model: 'Statistics'
        })
      return user
    } catch (err) {
      throw ApiError.databaseError(500, `Error get user with userId: ${userId} from database`, err);
    }
  }


  static async findByTgId(tgId) {
    try {
      logger.info("UserService::findByTgId")
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
          path: 'statistics',
          model: 'Statistics'
        })
      return user
    } catch (err) {
        throw ApiError.databaseError(500, `Error get user with tgId: ${tgId} from database`, err);
    }
  }


  static async create(userDto) {
    try {
      logger.info("UserService::create");

      // Создаём пользователя без game и statistics
      const user = await UserModel.create(userDto);

      // Создаём Game и Statistics, сразу привязывая userId
      const game = await GameService.create({ userId: user._id });
      const statistics = await StatisticsService.create({ userId: user._id });

      // Обновляем пользователя, привязывая game и statistics
      user.game = game._id;
      user.statistics = statistics._id;
      await user.save();
      return user;
    } catch (err) {
      throw ApiError.databaseError(500, `Error when creating user`, err);
    }
  }

}

module.exports = UserService;