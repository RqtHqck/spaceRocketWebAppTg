const ApiError = require('../../errors/ApiError');
const logger = require('../../utils/logger');
const Joi = require('joi');

module.exports.validateItemDto = (req, res, next) => {
  logger.info("validate validateItemDto..")
  const itemDto = req.body;

  const ItemDtoSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    levelRequired: Joi.number().required(),
    basePrice: Joi.number().required(),
    baseIncome: Joi.number().required(),
    priceMultiplier: Joi.number().required(),
    incomeMultiplier: Joi.number().required(),
    imageUrl: Joi.string().required(),
  });

  const { error } = ItemDtoSchema.validate(itemDto);
  if (error) {
    next(ApiError.validationError('Error validateUserCreateDto', error, error.details[0].message));
  }

  next()
}