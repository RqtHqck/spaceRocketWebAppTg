const logger = require('../utils/logger');
const UserRepository = require('@repository/UserRepository');
const UserService = require('@services/UserService');


class UserController {

  static async create(req, res, next) {
    try {
      const userDto = req.body
      logger.info('UserController::create')
      const user = await UserService.create(userDto);
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

}

module.exports = UserController;