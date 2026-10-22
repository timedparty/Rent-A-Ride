const Booking = require('../models/booking.js');
const Vehicle = require('../models/vehicle.js')
const mongoose = require('mongoose');
const Branch = require('../models/branch.js');

async function createBooking(req, res) {
    const allowed = ['vehicle', 'pickupBranch', 'dropoffBranch', 'pickupDate', 'returnDate']
    try {
        const {vehicle, pickupBranch, dropoffBranch, pickupDate, returnDate} = req.body
        if(!vehicle || !pickupBranch || !dropoffBranch || !pickupDate || !returnDate) {
            return res.status(400).json({message: "All fields must be present"})
        }
        if(!mongoose.Types.ObjectId.isValid(vehicle) || !mongoose.Types.ObjectId.isValid(pickupBranch) ||!mongoose.Types.ObjectId.isValid(dropoffBranch)) {
            return res.status(400).json({message: "Invalid ID"})
        }
        const keys = Object.keys(req.body)
        const allfieldspresent = allowed.every(field => keys.includes(field))
        const reqfieldspresent = keys.every(field => allowed.includes(field))
        if(!allfieldspresent || !reqfieldspresent) {
            return res.status(400).json({message: "Must contain only required fields"})
        }
        const vehicleData = await Vehicle.findById(vehicle)
        if(!vehicleData) {
            return res.status(404).json({message: "Vehicle not found.Try again with another vehicle"})
        }

        if(vehicleData.status !== 'available') {
            return res.status(409).json({message: "vehicle is unavailable"})
        }

        const [pickup, dropoff] = await Promise.all([
            Branch.findById(pickupBranch),
            Branch.findById(dropoffBranch)
        ])
        if (!pickup || !pickup.isActive) {
            return res.status(400).json({ message: 'Pickup branch not found or is currently inactive' });
        }
        if (!dropoff || !dropoff.isActive) {
            return res.status(400).json({ message: 'Dropoff branch not found or is currently inactive' });
        }

        const start = new Date(pickupDate);
        const end = new Date(returnDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            return res.status(400).json({ message: 'Pickup date must be a valid date and strictly before return date' });
        }
        const diffInMs = end.getTime() - start.getTime();
        const totalDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        const totalCost = totalDays * vehicleData.dailyRent;
        const overlap = await Booking.findOne({
            vehicle: vehicle,
            status: { $in: ['pending', 'confirmed', 'active'] },
            pickupDate: { $lt: end },
            returnDate: { $gt: start }
        });
        if (overlap) {
            return res.status(409).json({ message: 'Vehicle is already booked for the selected dates' });
        }
        const newBooking = new Booking({
            customer: req.user.id,
            vehicle,
            pickupBranch,
            dropoffBranch,
            pickupDate: start,
            returnDate: end,
            totalDays,
            totalCost,
            status: 'pending'
        });
        await newBooking.save();
        return res.status(201).json({
            message: 'Booking created successfully',
            booking: newBooking
        });
    }

    catch(error) {
        console.error(error)
        return res.status(500).json({message: "Server error, please try again after some time"})
    }
}

async function getMyBookings(req, res) {
    try {
        const bookings = await Booking.find({customer: req.user.id})
            .sort({createdAt:  -1})
            .populate('vehicle', 'vehicleBrand vehicleModel registrationNo dailyRent')
            .populate('pickupBranch', 'branchName city')
            .populate('dropoffBranch', 'branchName city')

        return res.status(200).json(bookings)
    }

    catch(error) {
        console.error(error)
        res.status(500).json({message: "Server error please try again after some time"})
    }
}

async function cancelBooking(req, res) {
    try {
        const id = req.params.id
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid booking id"})
        }

        const booking = await Booking.findById(id)
        if(!booking) {
            return res.status(404).json({message: "Booking not found"})
        }

        if(booking.customer.toString() !== req.user.id) {
            return res.status(403).json({message: "Invalid booking"})
        }

        if(!['pending', 'confirmed'].includes(booking.status)) {
            return res.status(400).json({message: `Cannot cancel a booking that is '${booking.status}'`})
        }
        booking.status = 'cancelled'
        await booking.save()
        return res.status(200).json({message: "Booking cancelled successfully", booking})
    }

    catch(error) {
        console.error(error)
        res.status(500).json({message: "Server error please try again after some time"})
    }
}

module.exports = {createBooking, getMyBookings, cancelBooking}