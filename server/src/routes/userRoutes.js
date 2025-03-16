const express = require('express');
const UserController = require('../controllers/UserController')
const userRouter = express.Router()

// localhost:3000/api/user/
userRouter.get('/', UserController.findById)
// localhost:3000/api/user/
userRouter.get('/', UserController.findAll)
// localhost:3000/api/user/
userRouter.post('/', UserController.create)
// localhost:3000/api/user/incCoins
userRouter.post('/incCoins', UserController.incrementCoins)
// localhost:3000/api/user/getCoins
userRouter.get('/getCoins', UserController.getCoins)

module.exports = userRouter