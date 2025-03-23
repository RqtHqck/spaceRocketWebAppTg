const PlanetModel = require('../models/PlanetModel')
const ApiError = require('@errors/ApiError')
const logger = require('../utils/logger');


class PlanetService {

  static async findAll() {
    try {
      logger.info("PlanetService::findAll")
      return await PlanetModel.find()
    } catch (err) {
      throw ApiError.databaseError(500, "Error find planets", err);
    }
  }


  static async findById(itemId) {
    try {
      logger.info("PlanetService::findById")
      return await PlanetModel.findById(itemId);
    } catch (err) {
      throw ApiError.databaseError(500, "Error find planet", err);
    }
  }


  static async create(planetDto) {
    try {
      logger.info("PlanetService::create: " + JSON.stringify(planetDto));
      return await PlanetModel.create(planetDto);
    } catch (err) {
      throw ApiError.databaseError(500,`Error create planet`, err);
    }
  }


  static async createMany(planetsDto) {
    try {
      logger.info("PlanetService::create: " + JSON.stringify(planetsDto));
      return await PlanetModel.insertMany(planetsDto, {ordered: true});
    } catch (err) {
      throw ApiError.databaseError(500, `Error create planets`, err);
    }
  }
}

module.exports = PlanetService;
