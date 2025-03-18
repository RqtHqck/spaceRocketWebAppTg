const express = require('express');
const ItemController = require('../controllers/ItemController')
const itemRouter = express.Router()

// POST: localhost:3000/api/shop/item
itemRouter.post('/item', ItemController.create)
// POST: localhost:3000/api/shop/item
itemRouter.post('/items', ItemController.createMany)
// GET: localhost:3000/api/shop/item
itemRouter.get('/items', ItemController.findAll)

module.exports = itemRouter;