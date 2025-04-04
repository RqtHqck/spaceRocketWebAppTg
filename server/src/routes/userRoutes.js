const express = require('express');
const UserController = require('../controllers/UserController')
const { validateUserCreateDto }  = require('../middlewares/validators/validateUserCreate');
const userRouter = express.Router()

// ---------------------- User routes
// POST: localhost:3000/api/user/
userRouter.post('/', validateUserCreateDto, UserController.create)
// GET: localhost:3000/api/user/all
userRouter.get('/all', UserController.findAll)
// GET: localhost:3000/api/user/tg/:tgId
userRouter.get('/tg/:tgId', UserController.findByTgId)
// GET: localhost:3000/api/user/sorted
userRouter.get('/sorted', UserController.findSorted)
// GET: localhost:3000/api/user/userId
userRouter.get('/:userId', UserController.findByUserId)
// // GET: localhost:3000/api/user/filters?sort=level/exp/coins/createdAt
// userRouter.get('/filters', UserController.fetchFiltered)

module.exports = userRouter