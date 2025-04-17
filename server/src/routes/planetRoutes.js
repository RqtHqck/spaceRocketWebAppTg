const express = require('express');
const PlanetController = require('../controllers/PlanetController')
const {validateItemDto} = require('../middlewares/validators/validateItem');
const planetRouter = express.Router()

// POST: localhost:3000/api/planets
planetRouter.post('/', PlanetController.create)
// POST: localhost:3000/api/planets
planetRouter.post('/many', PlanetController.createMany)
// GET: localhost:3000/api/planets/all
planetRouter.get('/all', PlanetController.findAll)
// GET: localhost:3000/api/planets/filters?index=index
planetRouter.get('/filters', PlanetController.findOne)
// GET: localhost:3000/api/planets/:planetId
planetRouter.get('/:planetId', PlanetController.findById)

module.exports = planetRouter;