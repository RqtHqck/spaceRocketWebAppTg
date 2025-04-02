const app = require('./app')
const logger = require('@utils/logger')
const ApiError = require('./errors/ApiError');
const mongoose = require('mongoose');
const http = require('http');
const server = http.createServer(app);
require('./events/eventListeners');

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
  server.listen(process.env.LOCAL_PORT, () => {
    logger.info(`Server started http://localhost:${process.env.LOCAL_PORT}.`)
  })
})()

