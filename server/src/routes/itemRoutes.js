const express = require('express');
const ItemController = require('../controllers/ItemController')
const {validateItemDto} = require('../middlewares/validators/validateItemDto');
const itemRouter = express.Router()

// POST: localhost:3000/api/shop/items
itemRouter.post('/item', validateItemDto, ItemController.create)
// POST: localhost:3000/api/shop/items
itemRouter.post('/items', ItemController.createMany)
// GET: localhost:3000/api/shop/items
itemRouter.get('/items', ItemController.findAll)
// GET: localhost:3000/api/shop/item/:itemId
itemRouter.get('/items/:itemId', ItemController.findAll)

module.exports = itemRouter;