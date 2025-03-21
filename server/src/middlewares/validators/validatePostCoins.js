const ApiError = require('../../errors/ApiError');
const logger = require('../../utils/logger');
const Joi = require('joi');

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