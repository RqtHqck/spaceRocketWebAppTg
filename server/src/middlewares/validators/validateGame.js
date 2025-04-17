const logger = require('../../utils/logger');
const Joi = require('joi');
const ApiError = require('../../errors/ApiError');


module.exports.validateItemPurchase = (req, res, next) => {
  logger.info("validate validateUserAddItem..")
  const userItemPostDto = req.body;

  const requestSchema = Joi.object({
    userId: Joi.string().required(),
    itemId: Joi.string().required(),
  });

  const { error } = requestSchema.validate(userItemPostDto);
  if (error) {
    next(ApiError.validationError('Error validateUserAddItem ', error, error.details[0].message));
  }

  next()
}


module.exports.validatePostCoinsDto = (req, res, next) => {
  logger.info("validate CoinsPostDto..")
  const coinsPostDto = req.body;

  const PostCoinsSchema = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().optional(),
  });

  const { error } = PostCoinsSchema.validate(coinsPostDto);
  if (error) {
    next(ApiError.validationError('Error validateUserDto', error, error.details[0].message));
  }

  next()
}