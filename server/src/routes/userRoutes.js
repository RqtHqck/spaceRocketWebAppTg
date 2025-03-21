const express = require('express');
const UserController = require('../controllers/UserController')
const { validateUserCreateDto }  = require('../middlewares/validators/validateUserCreate');
const { validatePostCoinsDto } = require('../middlewares/validators/validatePostCoins');
const {validateUserAddItem} = require('../middlewares/validators/validateUserAddItem');
const userRouter = express.Router()

// ---------------------- User routes
// POST: localhost:3000/api/user/
userRouter.post('/', validateUserCreateDto, UserController.create)
// GET: localhost:3000/api/user/tg/:tgId
userRouter.get('/tg/:tgId', UserController.findByTgId)
// GET: localhost:3000/api/user/userId
userRouter.get('/:userId', UserController.findByUserId)
// GET: localhost:3000/api/user/
userRouter.get('/', UserController.findAll)

// ---------------------- Coins routes
// POST: localhost:3000/api/user/coins
userRouter.post('/coins', validatePostCoinsDto, UserController.incrementCoins)
// GET: localhost:3000/api/user/coins
userRouter.get('/:userId/coins', UserController.getCoins)

// ---------------------- Items routes
// POST: localhost:3000/api/user/updatesInventory
userRouter.post('/items', validateUserAddItem, UserController.addItem)
// GET: localhost:3000/api/user/updatesInventory
userRouter.get('/:userId/items', UserController.getUserItems)


module.exports = userRouter