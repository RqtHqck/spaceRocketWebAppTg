const express = require('express');
const ItemController = require('../controllers/ItemController')
const itemRouter = express.Router()

// POST: localhost:3000/api/user/
itemRouter.post('/', ItemController.create)
// GET: localhost:3000/api/user/
// itemRouter.get('/', ItemController.findById)
// GET: localhost:3000/api/user/
itemRouter.get('/', ItemController.findAll)

module.exports = itemRouter;