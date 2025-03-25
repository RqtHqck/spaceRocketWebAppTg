const TransactionModel = require('@models/TransactionModel');
const ApiError = require('@errors/ApiError');
const logger = require('@utils/logger');


class TransactionRepository {

  static async findAll() {
    try {
      logger.info("TransactionRepository::findAll")
      return await TransactionModel.find()
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении транзакций", err);
    }
  }


  static async findById(transactionId) {
    try {
      logger.info("TransactionRepository::findById")
      return await TransactionModel.findById(transactionId);
    } catch (err) {
      throw ApiError.internalError("Ошибка при получении транзакции", err);
    }
  }


  static async create(transactionDto) {
    try {
      logger.info("TransactionRepository::create: " + JSON.stringify(transactionDto));
      return await TransactionModel.create(transactionDto);
    } catch (err) {
      throw ApiError.internalError(`Ошибка при создании транзакции`, err);
    }
  }
}

module.exports = TransactionRepository;
