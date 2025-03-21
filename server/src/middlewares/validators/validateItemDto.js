const ApiError = require('../../errors/ApiError');
const logger = require('../../utils/logger');
const Joi = require('joi');

module.exports.validateItemDto = (req, res, next) => {
  logger.info("validate validateItemDto..")
  const itemDto = req.body;

  const ItemDtoSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    basePrice: Joi.number().optional(),
    baseIncome: Joi.number().optional(),
    priceMultiplier: Joi.number().optional(),
    incomeMultiplier: Joi.number().optional(),
    imageUrl: Joi.string().optional(),
  });

  const { error } = ItemDtoSchema.validate(itemDto);
  if (error) {
    next(ApiError.validationError('Error validateUserCreateDto', error, error.details[0].message));
  }

  next()
}