const UserRepository = require('@repository/UserRepositury');
const GameService = require('@services/GameService');
const StatisticsService = require('@services/StatisticService');
const logger = require('@utils/logger');
const ApiError = require('@errors/ApiError');


class UserService {
  static async createAppUser (userDto) {
    try {
      logger.info("UserService::create");

      // Создаём пользователя без game и statistics
      const user = await UserRepository.create(userDto);

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