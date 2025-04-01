const logger = require('../utils/logger');
const PlanetRepository = require('../repository/PlanetRepository');

class PlanetController {
  static async findAll(req, res, next) {
    try {
      logger.info('PlanetController::findAll');
      const planets = await PlanetRepository.findAll();
      res.status(200).json(planets);
    } catch (err) {
      next(err);
    }
  }

  static async findById(req, res, next) {
    try {
      logger.info('PlanetController::findById');
      const planetId = req.query.planetId;
      logger.info(`Query param: { planetId:${planetId} }`);
      const planet = await PlanetRepository.findById(planetId);
      res.status(200).json(planet);
    } catch (err) {
      next(err);
    }
  }


  static async findOne(req, res, next) {
    try {
      logger.info('PlanetController::findOne');
      const filters = req.query;
      logger.info(`Query params: ${JSON.stringify(filters)}`);
      const planet = await PlanetRepository.findOne(filters);
      res.status(200).json(planet);
    } catch (err) {
      next(err);
    }
  }


  static async create(req, res, next) {
    try {
      const planetDto = req.body;
      logger.info('PlanetController::create');
      const newPlanet = await PlanetRepository.create(planetDto);
      res.status(201).json(newPlanet);
    } catch (err) {
      next(err);
    }
  }

  static async createMany(req, res, next) {
    try {
      const planetsDto = req.body;
      logger.info('PlanetController::createMany');
      const newPlanets = await PlanetRepository.createMany(planetsDto);
      res.status(201).json(newPlanets);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PlanetController;
