require('./config/dotenv');
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require("morgan")
const router = require('./routes/index')

// SERVER
const app = express()
app.use(cors()) 
app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json())
app.use(compression());  // Response compression by different types 
app.use(helmet()); // Defense; from the XSS attacks
app.use(morgan("combined", { stream: logger.stream }))
app.use(router)
// app.use(errorHandler)


// MONGO
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => logger.info('MongoDB connected'))
//   .catch(err => logger.error(err))

// BOT
try {
  require('./bot/bot');
} catch (err) {
  logger.error(err);
}

module.exports = app