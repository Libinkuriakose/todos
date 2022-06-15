const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/jwt')

const createTodo = require('./createTodo')
const updateTodo = require('./updateTodo')
const get = require('./get')
const getex = require('./getExpiredTasks')

const validator = require('express-joi-validation').createValidator({})

router.get('/', auth.authenticateToken ,validator.query(get.querySchema), get.handler)
router.get('/extodos', auth.authenticateToken ,validator.query(getex.querySchema), getex.handler)
router.post('/create-todo',auth.authenticateToken ,validator.body(createTodo.bodySchema), createTodo.handler)
router.put('/update-todo',auth.authenticateToken ,validator.body(updateTodo.bodySchema), updateTodo.handler)

module.exports = {
    todosController: router
}
