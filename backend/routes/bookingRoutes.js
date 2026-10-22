const express = require('express')
const {createBooking} = require('../controllers/bookingController.js')
const {protect} = require('../middleware/authMiddleware.js')

const router = express.Router()
router.post('/', protect, createBooking)

module.exports = router