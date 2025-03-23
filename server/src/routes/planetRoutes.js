const express = require('express');
const PlanetController = require('../controllers/PlanetController')
const {validateItemDto} = require('../middlewares/validators/validateItemDto');
const planetRouter = express.Router()

// POST: localhost:3000/api/shop/items
planetRouter.post('/', PlanetController.create)
// POST: localhost:3000/api/shop/items
planetRouter.post('/', PlanetController.createMany)
// GET: localhost:3000/api/shop/items
planetRouter.get('/', PlanetController.findAll)
// GET: localhost:3000/api/shop/item/:itemId
planetRouter.get('/:planetId', PlanetController.findAll)

module.exports = planetRouter;