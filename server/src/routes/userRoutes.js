const express = require('express');
const UserController = require('../controllers/UserController')
const userRouter = express.Router()

// ---------------------- User routes
// POST: localhost:3000/api/user/
userRouter.post('/', UserController.create)
// GET: localhost:3000/api/user/tg/:tgId
userRouter.get('/tg/:tgId', UserController.findByTgId)
// GET: localhost:3000/api/user/userId
userRouter.get('/:userId', UserController.findByUserId)
// GET: localhost:3000/api/user/
userRouter.get('/', UserController.findAll)

// ---------------------- Coins routes
// POST: localhost:3000/api/user/coins
userRouter.post('/coins', UserController.incrementCoins)
// GET: localhost:3000/api/user/coins
userRouter.get('/:userId/coins', UserController.getCoins)

// ---------------------- Items routes
// POST: localhost:3000/api/user/updatesInventory
userRouter.post('/items', UserController.buyItem)
// GET: localhost:3000/api/user/updatesInventory
userRouter.get('/:userId/items', UserController.getUserItems)


module.exports = userRouter