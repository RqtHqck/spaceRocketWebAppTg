const express = require('express');
const GameController = require('../controllers/GameController')
const {validatePostCoinsDto} = require('../middlewares/validators/validatePostCoins');
const {validateItemPurchase} = require('../middlewares/validators/validateUserAddItem');

const gameRouter = express.Router()

// ---------------------- Game routes
// GET: localhost:3000/api/game/userId
gameRouter.get('/:userId', GameController.findByUserId)

// ---------------------- Coins routes
// POST: localhost:3000/api/game/coins
gameRouter.post('/coins', validatePostCoinsDto, GameController.incrementCoins)
// GET: localhost:3000/api/game/coins
gameRouter.get('/coins/:userId', GameController.getCoins)

// ---------------------- Items routes
// POST: localhost:3000/api/game/updatesInventory
gameRouter.post('/item/buy', validateItemPurchase, GameController.buyItem)
// POST: localhost:3000/api/game/updatesInventory
gameRouter.post('/item/upgrade', validateItemPurchase, GameController.upgradeItem)
// GET: localhost:3000/api/game/updatesInventory
gameRouter.get('/items/:userId', GameController.getUserItems)

// GET: localhost:3000/api/game/userPlanets/:userId
gameRouter.get('/planets/:userId', GameController.getUserPlanets)
// GET: localhost:3000/api/game/planets/currentIndex/:userId
gameRouter.get('/planets/currentIndex/:userId', GameController.getCurrentPlanetIndex)

gameRouter.post('/planet/buy', GameController.buyPlanet)

module.exports = gameRouter