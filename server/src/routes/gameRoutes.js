const express = require('express');
const GameController = require('../controllers/GameController')
const {validatePostCoinsDto} = require('../middlewares/validators/validatePostCoins');
const {validateItemPurchase} = require('../middlewares/validators/validateUserAddItem');

const gameRouter = express.Router()

// ---------------------- Game routes
// GET: localhost:3000/api/user/userId
gameRouter.get('/:userId', GameController.findByUserId)

// ---------------------- Coins routes
// POST: localhost:3000/api/user/coins
gameRouter.post('/coins', validatePostCoinsDto, GameController.incrementCoins)
// GET: localhost:3000/api/user/coins
gameRouter.get('/coins/:userId', GameController.getCoins)

// ---------------------- Items routes
// POST: localhost:3000/api/user/updatesInventory
gameRouter.post('/item/buy', validateItemPurchase, GameController.buyItem)
// POST: localhost:3000/api/user/updatesInventory
gameRouter.post('/item/upgrade', validateItemPurchase, GameController.upgradeItem)
// GET: localhost:3000/api/user/updatesInventory
gameRouter.get('/items/:userId', GameController.getItems)


module.exports = gameRouter