const PlanetModel = require('../models/PlanetModel')
const ApiError = require('@errors/ApiError')
const logger = require('../utils/logger');


class PlanetRepository {

  static async findAll() {
    try {
      logger.info("PlanetRepository::findAll")
      return await PlanetModel.find().sort({ index: -1 })
    } catch (err) {
      throw ApiError.databaseError(500, "Error find planets", err);
    }
  }


  static async findById(itemId) {
    try {
      logger.info("PlanetRepository::findById")
      return await PlanetModel.findById(itemId);
    } catch (err) {
      throw ApiError.databaseError(500, "Error find planet", err);
    }
  }


  static async create(planetDto) {
    try {
      logger.info("PlanetRepository::create: " + JSON.stringify(planetDto));
      return await PlanetModel.create(planetDto);
    } catch (err) {
      throw ApiError.databaseError(500,`Error create planet`, err);
    }
  }


  static async createMany(planetsDto) {
    try {
      logger.info("PlanetRepository::create: " + JSON.stringify(planetsDto));
      return await PlanetModel.insertMany(planetsDto, {ordered: true});
    } catch (err) {
      throw ApiError.databaseError(500, `Error create planets`, err);
    }
  }
}

module.exports = PlanetRepository;
