const express = require('express');
const UserController = require('../controllers/UserController')
const userRouter = express.Router()

// POST: localhost:3000/api/user/
userRouter.post('/', UserController.create)
// GET: localhost:3000/api/user/
userRouter.get('/', UserController.findById)
// GET: localhost:3000/api/user/
userRouter.get('/', UserController.findAll)
// POST: localhost:3000/api/user/coins
userRouter.post('/coins', UserController.incrementCoins)
// GET: localhost:3000/api/user/coins
userRouter.get('/coins', UserController.getCoins)

module.exports = userRouter