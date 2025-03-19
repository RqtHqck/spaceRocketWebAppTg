const app = require('./app')
const logger = require('@utils/logger')
const ApiError = require('./errors/ApiError');
const mongoose = require('mongoose');

(() => {
  // MONGO
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => logger.info('MongoDB connected'))
    .catch(err => ApiError.internalError('MongoDb not connected', err))
  // BOT
  try {
    require('./bot/bot');
  } catch (err) {
    logger.error(err);
  }
  // SERVER
  app.listen(process.env.LOCAL_PORT, () => {
    logger.info(`Server started on docker port http://localhost:${process.env.DOCKER_PORT}. \nIt's available from http://localhost:${process.env.LOCAL_PORT}`)
  })
})()

