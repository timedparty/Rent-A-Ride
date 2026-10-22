const Payment = require('../models/payment.js');
const Booking = require('../models/booking.js');
const mongoose = require('mongoose');

async function processPayment(req, res) {
    try {
        const { bookingId } = req.params;
        const { paymentMethod } = req.body;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID format' });
        }

        const allowedMethods = ['upi', 'card', 'cash'];
        if (!paymentMethod || !allowedMethods.includes(paymentMethod.toLowerCase())) {
            return res.status(400).json({ message: 'Payment method must be upi, card, or cash' });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.customer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: Booking does not belong to you' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({
                message: `Cannot pay for a booking with status '${booking.status}'. Only pending bookings can be paid.`
            });
        }

        const existingPayment = await Payment.findOne({ booking: bookingId });
        if (existingPayment) {
            return res.status(409).json({ message: 'A payment record already exists for this booking' });
        }

        const transactionId = `DEMO_TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

        const payment = new Payment({
            booking: booking._id,
            customer: req.user.id,
            amount: booking.totalCost,
            paymentMethod: paymentMethod.toLowerCase(),
            paymentStatus: 'paid',
            transactionId
        });

        await payment.save();

        booking.status = 'confirmed';
        await booking.save();

        return res.status(201).json({
            message: 'Demo payment recorded successfully',
            payment
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error, please try again after some time' });
    }
}

async function getMyPayments(req, res) {
    try {
        const payments = await Payment.find({ customer: req.user.id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'booking',
                populate: {
                    path: 'vehicle',
                    select: 'vehicleBrand vehicleModel registrationNo'
                }
            });

        return res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error, please try again after some time' });
    }
}

module.exports = { processPayment, getMyPayments };
