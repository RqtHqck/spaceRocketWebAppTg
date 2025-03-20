const express = require('express');
const router = express.Router()
const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');
const transactionRoutes = require('./transactionRoutes');

const isTelegramMobileUser = require('../middlewares/isTelegramMobileUser');

router.use('/api/user', userRoutes);
router.use('/api/shop', itemRoutes);
router.use('/api/transaction', transactionRoutes);

module.exports = router