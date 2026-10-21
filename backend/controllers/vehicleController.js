const Vehicle = require('../models/vehicle.js')

async function addVehicle(req, res) {
    try {
        const { vehicleBrand, vehicleModel, vehicleType, registrationNo, dailyRent, status } = req.body
        const exists = await Vehicle.findOne({ registrationNo : registrationNo })
        if(exists) {
            return res.status(409).json({ message: 'Vehicle already exists' })
        }
        const newVehicle = new Vehicle({
            vehicleBrand : vehicleBrand,
            vehicleModel : vehicleModel,
            vehicleType : vehicleType,
            registrationNo : registrationNo,
            dailyRent : dailyRent,
            status : status
        })

        await newVehicle.save()
        res.status(201).json({ message: 'Vehicle added successfully' })
    }

    catch (error) {
        res.status(500).json({ message: 'Server error, please try again after some time', error})
        console.error(error)
    }
}

async function getVehicles(req, res) {
    try {
        const vehicles = await Vehicle.find().sort({ createdAt: -1 })
        res.json(vehicles)
    }

    catch (error) {
        res.status(500).json({ message: 'Server error, please try again after some time'})
        console.error(error)
    }
}

module.exports = { addVehicle, getVehicles }