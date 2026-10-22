const express = require('express');
const { processPayment, getMyPayments } = require('../controllers/paymentController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/my-payments', protect, getMyPayments);
router.post('/:bookingId', protect, processPayment);

module.exports = router;
