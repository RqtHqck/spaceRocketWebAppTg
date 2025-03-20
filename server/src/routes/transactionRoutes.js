const express = require('express');
const TransactionController = require('../controllers/TransactionController')
const transactionRouter = express.Router()

// POST: localhost:3000/api/shop/item
transactionRouter.post('/transactions', TransactionController.create)
// POST: localhost:3000/api/shop/item/:
transactionRouter.post('/transactions/:transactionId', TransactionController.findById)
// GET: localhost:3000/api/shop/item
transactionRouter.get('/transactions', TransactionController.findAll)

module.exports = transactionRouter;