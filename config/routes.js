const express = require('express');
const router = express.Router();

const { usersController } = require('../app/controllers/users')
const { todosController } = require('../app/controllers/todo')

// router.use('/user', userController)
router.use('/users', usersController)
router.use('/to-do', todosController)

module.exports = router
