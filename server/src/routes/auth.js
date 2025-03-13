const express = require('express');
const controller = require('../controllers/auth')
const authRouter = express.Router()

// localhost:3000/api/auth/login
authRouter.post('/login', controller.login)
// localhost:3000/api/auth/register
authRouter.post('/register', controller.register)

module.exports = authRouter