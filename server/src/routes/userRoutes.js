const express = require('express');
const UserController = require('../controllers/UserController')
const userRouter = express.Router()

// ---------------------- User routes
// POST: localhost:3000/api/user/
userRouter.post('/', UserController.create)
// GET: localhost:3000/api/user/
userRouter.get('/', UserController.findById)
// GET: localhost:3000/api/user/
userRouter.get('/', UserController.findAll)

// ---------------------- Coins routes
// POST: localhost:3000/api/user/coins
userRouter.post('/coins', UserController.incrementCoins)
// GET: localhost:3000/api/user/coins
userRouter.get('/coins', UserController.getCoins)

// ---------------------- Items routes
// POST: localhost:3000/api/user/updatesInventory
userRouter.post('/items', UserController.addItem)
// GET: localhost:3000/api/user/updatesInventory
userRouter.get('/items', UserController.getUserItems)


module.exports = userRouter