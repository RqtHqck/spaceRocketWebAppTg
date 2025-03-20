const express = require('express');
const ItemController = require('../controllers/ItemController')
const itemRouter = express.Router()

// POST: localhost:3000/api/shop/items
itemRouter.post('/item', ItemController.create)
// POST: localhost:3000/api/shop/items
itemRouter.post('/items', ItemController.createMany)
// GET: localhost:3000/api/shop/items
itemRouter.get('/items', ItemController.findAll)
// GET: localhost:3000/api/shop/item
itemRouter.get('/items/:itemId', ItemController.findAll)

module.exports = itemRouter;