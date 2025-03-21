const ApiError = require('../../errors/ApiError');
const logger = require('../../utils/logger');
const Joi = require('joi');

module.exports.validateUserAddItem = (req, res, next) => {
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