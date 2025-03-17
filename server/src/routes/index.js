const express = require('express');
const router = express.Router()
const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');

const isTelegramMobileUser = require('../middlewares/isTelegramMobileUser');


router.use('/api/user', userRoutes);
router.use('/api/shop', itemRoutes);

module.exports = router