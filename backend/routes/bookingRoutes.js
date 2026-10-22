const express = require('express')
const {createBooking, getMyBookings, cancelBooking} = require('../controllers/bookingController.js')
const {protect} = require('../middleware/authMiddleware.js')

const router = express.Router()
router.post('/', protect, createBooking)
router.get('/my-bookings', protect, getMyBookings)
router.patch('/:id/cancel', protect, cancelBooking)

module.exports = router