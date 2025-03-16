const express = require('express');
const UserController = require('../controllers/UserController')
const userRouter = express.Router()

userRouter.get('/', UserController.findById)
// localhost:3000/api/user/
userRouter.get('/', UserController.findAll)
// localhost:3000/api/user/
// localhost:3000/api/user/
userRouter.post('/', UserController.create)
// localhost:3000/api/auth/register
userRouter.post('/incCoins', UserController.incrementCoins)


module.exports = userRouter