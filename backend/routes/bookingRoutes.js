const express = require('express')
const {createBooking, getMyBookings, cancelBooking, getAllBookings, updateBookingStatus} = require('../controllers/bookingController.js')
const {protect, adminOnly} = require('../middleware/authMiddleware.js')

const router = express.Router()
router.post('/', protect, createBooking)
router.get('/my-bookings', protect, getMyBookings)
router.get('/', protect, adminOnly, getAllBookings)
router.patch('/:id/cancel', protect, cancelBooking)
router.patch('/:id/status', protect, adminOnly, updateBookingStatus)

module.exports = router