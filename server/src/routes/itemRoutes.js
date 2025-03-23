const express = require('express');
const ItemController = require('../controllers/ItemController')
const {validateItemDto} = require('../middlewares/validators/validateItemDto');
const itemRouter = express.Router()

// POST: localhost:3000/api/shop/items
itemRouter.post('/', ItemController.create)
// POST: localhost:3000/api/shop/items
itemRouter.post('/', ItemController.createMany)
// GET: localhost:3000/api/shop/items
itemRouter.get('/', ItemController.findAll)
// GET: localhost:3000/api/shop/item/:itemId
itemRouter.get('/:itemId', ItemController.findAll)

module.exports = itemRouter;