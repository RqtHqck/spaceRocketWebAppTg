const TransactionModel = require('../models/TransactionModel');
const ApiError = require('@errors/ApiError');
const logger = require('../utils/logger');


class TransactionService {

  static async findAll() {
    try {
      logger.info("TransactionService::findAll")
      return await TransactionModel.find()
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении транзакций", err);
    }
  }


  static async findById(transactionId) {
    try {
      logger.info("TransactionService::findById")
      return await TransactionModel.findById(transactionId);
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении транзакции", err);
    }
  }


  static async create(transactionDto,  session = null) {
    try {
      logger.info("TransactionService::create: " + JSON.stringify(transactionDto));
      const options = session ? { session } : {};
      return await TransactionModel.create([transactionDto], options);
    } catch (err) {
      throw ApiError.internalError(`Ошибка при создании транзакции`, err);
    }
  }
}

module.exports = TransactionService;
