const express = require('express');
const router = express.Router()
const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');
const gameRoutes = require('./gameRoutes');
const planetRoutes = require('./planetRoutes');

const isTelegramMobileUser = require('../middlewares/isTelegramMobileUser');

router.use('/api/users', userRoutes);
router.use('/api/items', itemRoutes);
router.use('/api/planets', planetRoutes);
router.use('/api/game', gameRoutes);

module.exports = router