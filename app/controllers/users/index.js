const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/jwt')

// const get = require('./get')
const signUp = require('./signUp')
const login = require('./login')

const validator = require('express-joi-validation').createValidator({})

// router.get('/', auth.authenticateToken ,validator.query(get.querySchema), get.handler)
router.post('/signup',validator.body(signUp.bodySchema), signUp.handler)
router.post('/login',validator.body(login.bodySchema), login.handler)

module.exports = {
    usersController: router
}
