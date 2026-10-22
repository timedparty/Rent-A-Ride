const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
            unique: true
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        paymentMethod: {
            type: String,
            enum: ['upi', 'card', 'cash'],
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['paid', 'failed', 'refunded'],
            default: 'paid'
        },
        transactionId: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Payment', PaymentSchema, 'payments');
