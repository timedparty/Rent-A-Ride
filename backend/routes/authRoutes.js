const express = require('express')
const register = require('../controllers/authController.js').register
const login = require('../controllers/authController.js').login
const getMe = require('../controllers/authController.js').getMe
const protect = require('../middleware/authMiddleware.js').protect

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)

module.exports = router