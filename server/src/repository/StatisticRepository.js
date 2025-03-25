const logger = require('@utils/logger');
const StatisticsModel = require('@models/StatisticModel');
const ApiError = require('@errors/ApiError');


class StatisticRepository {

  static async create(statisticsDto) {
    try {
      logger.info(`StatisticRepository::create dto: ${JSON.stringify(statisticsDto)}`);
      return await StatisticsModel.create(statisticsDto);
    } catch (err) {
      throw ApiError.databaseError(500, `Error when creating statistics document`, err);
    }
  }
}

module.exports = StatisticRepository;