const ApiError = require('../../errors/ApiError');
const logger = require('../../utils/logger');
const Joi = require('joi');

module.exports.validateUserCreateDto = (req, res, next) => {
  logger.info("validate userCreateDto..")
  const userCreateDto = req.body;

  const UserCreateDtoSchema = Joi.object({
    tgId: Joi.string().min(4).max(64).required(),
    userName: Joi.string().optional(),
    imageUrl: Joi.string().optional(),
  });

  const { error } = UserCreateDtoSchema.validate(userCreateDto);
  if (error) {
    next(ApiError.validationError('Error validateUserCreateDto', error, error.details[0].message));
  }

  next()
}