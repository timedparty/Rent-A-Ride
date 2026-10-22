const mongoose = require('mongoose')


const BookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },

    pickupBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },

    dropoffBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },

    pickupDate: {
        type: Date,
        required: true
    },

    returnDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.pickupDate;
            },
            message: 'Return date must be greater than pickup date'
        }
    },

    totalDays: {
        type: Number,
        required: true
    },

    totalCost: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'active', 'cancelled', 'completed'],
        default: 'pending'
    }
}, 
{ 
    timestamps: true
})

module.exports = mongoose.model('Booking', BookingSchema, 'bookings')