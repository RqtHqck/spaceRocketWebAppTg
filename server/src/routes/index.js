const express = require('express');
const router = express.Router()
const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');
const gameRoutes = require('./gameRoutes');
const planetRoutes = require('./planetRoutes');
const transactionRoutes = require('./transactionRoutes');

const isTelegramMobileUser = require('../middlewares/isTelegramMobileUser');

router.use('/api/users', userRoutes);
router.use('/api/items', itemRoutes);
router.use('/api/planets', planetRoutes);
router.use('/api/game', gameRoutes);
router.use('/api/transactions', transactionRoutes);

module.exports = router