const logger = require('@utils/logger');
const TransactionRepository = require('@repository/TransactionRepository');

class TransactionController {
  static async findAll(req, res, next) {
    try {
      logger.info('TransactionController::findAll')
      const transactions = await TransactionRepository.findAll();
      res
        .status(200)
        .json(transactions);
    } catch (err) {
      next(err)
    }
  }


  static async findById(req, res, next) {
    try {
      logger.info('TransactionController::findById')
      const transactionId = req.query.transactionId;
      logger.info(`Query param: { transactionId:${transactionId} }`)
      const transaction = await TransactionRepository.findById(transactionId);
      res
        .status(200)
        .json(transaction);
    } catch (err) {
      next(err)
    }
  }


  static async create(req, res, next) {
    try {
      const transactionDto = req.body
      logger.info('TransactionController::create')
      const transaction = await TransactionRepository.create(transactionDto);
      res
        .status(201)
        .json(transaction);
    } catch (err) {
      next(err)
    }
  }

}

module.exports = TransactionController;