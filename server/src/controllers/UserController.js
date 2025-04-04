const logger = require('../utils/logger');
const UserRepository = require('@repository/UserRepository');
const UserService = require('@services/UserService');


class UserController {

  static async create(req, res, next) {
    try {
      logger.info('UserController::create')
      const userDto = req.body
      logger.info(`Body: userDto:${JSON.stringify(userDto)} }`)
      const user = await UserService.createAppUser(userDto);
      res
        .status(201)
        .json(user);
    } catch (err) {
      next(err)
    }
  }

  
  static async findAll(req, res, next) {
    try {
      logger.info('UserController::findAll')
      const user = await UserRepository.findAll();
      res
        .status(200)
        .json(user);
    } catch (err) {
      next(err)
    }
  }


  static async findByUserId(req, res, next) {
    try {
      logger.info('UserController::findByUserId')
      const userId = req.params.userId;
      logger.info(`Query param: { userId:${userId} }`)
      const user = await UserRepository.findByUserId(userId);
      res
        .status(200)
        .json(user);
    } catch (err) {
      next(err)
    }
  }


  static async findByTgId(req, res, next) {
    try {
      logger.info('UserController::findByTgId')
      const tgId = req.params.tgId.toString();
      logger.info(`Query param: { tgId:${tgId} }`)
      const user = await UserRepository.findByTgId(tgId);
      res
        .status(200)
        .json(user);
    } catch (err) {
      next(err)
    }
  }


  static async findSorted(req, res, next) {
    try {
      logger.info('UserController::findSorted')
      const users = await UserRepository.findSorted();
      res
        .status(200)
        .json(users);
    } catch (err) {
      next(err)
    }
  }


  // static async findFiltered(req, res, next) {
  //   try {
  //     logger.info('UserController::findFiltered')
  //     const filters = req.query;
  //     logger.info(`Query param: ${JSON.stringify(filters)}`)
  //     const users = await UserService.fetchFiltered(filters);
  //     res
  //       .status(200)
  //       .json(users);
  //   } catch (err) {
  //     next(err)
  //   }
  // }


}

module.exports = UserController;