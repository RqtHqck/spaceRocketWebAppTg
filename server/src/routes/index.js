const express = require('express');
const router = express.Router()
const userRoutes = require('./userRoutes');
const isTelegramMobileUser = require('../middlewares/isTelegramMobileUser');


router.use('/api/user', userRoutes);

module.exports = router