const express = require('express');
const GameController = require('../controllers/GameController')
const {validateItemPurchase, validatePostCoinsDto} = require('../middlewares/validators/validateGame');

const gameRouter = express.Router()

// ---------------------- Game routes
// GET: localhost:3000/api/game/userId
gameRouter.get('/:userId', GameController.findByUserId)

// ---------------------- Coins routes
// POST: localhost:3000/api/game/coins
gameRouter.post('/coins', validatePostCoinsDto, GameController.incrementCoinsByClick)
// POST: /api/game/absentReward/:userId
gameRouter.post('/coins/absentReward', validatePostCoinsDto, GameController.incrementCoinsAbsentReward);
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
// POST: localhost:3000/api/game/planet/buy
gameRouter.post('/planet/buy', GameController.buyPlanet)

// GET: localhost:3000/api/game/level/:userId
gameRouter.get('/level/:userId', GameController.getLevel)

module.exports = gameRouter