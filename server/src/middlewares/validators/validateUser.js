const logger = require('../../utils/logger');
const Joi = require('joi');
const ApiError = require('../../errors/ApiError');


module.exports.validateUserUpdateDto = (req, res, next) => {
  logger.info("validate UserUpdateDto..")
  const body = req.body;

  const updateDtoSchema = Joi.object({
    tgId: Joi.string().min(4).max(64).optional(),
    userName: Joi.string().optional(),
    lastOnline: Joi.string().optional(),
    imageUrl: Joi.string().optional(),
  });

  const { error } = updateDtoSchema.validate(body);
  if (error) {
    next(ApiError.validationError('Error validateUserUpdateDto', error, error.details[0].message));
  }

  next()
}


module.exports.validateUserCreateDto = (req, res, next) => {
  logger.info("validate userCreateDto..")
  const userCreateDto = req.body;

  const createDtoSchema = Joi.object({
    tgId: Joi.string().min(4).max(64).required(),
    userName: Joi.string().optional(),
    lastOnline: Joi.string().optional(),
    imageUrl: Joi.string().optional(),
  });

  const { error } = createDtoSchema.validate(userCreateDto);
  if (error) {
    next(ApiError.validationError('Error validateUserCreateDto', error, error.details[0].message));
  }

  next()
}
