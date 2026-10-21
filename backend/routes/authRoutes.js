const express = require('express')
const register = require('../controllers/authController.js').register
const login = require('../controllers/authController.js').login

const router = express.Router()

router.post('/register', register)
router.post('/login', login)

module.exports = router