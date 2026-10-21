const Vehicle = require('../models/vehicle.js')
const mongoose = require('mongoose')

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

async function getVehicleById(req, res) {
    try {
        const vehicleId = req.params.id
        const vehicle = await Vehicle.findById(vehicleId)
        if(!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' })
        }
        res.json(vehicle)
    }
    catch (error) {
        res.status(500).json({ message: 'Server error, please try again after some time'})
        console.error(error)
    }
}

async function updateVehicle(req, res) {
    const allowed = ['vehicleBrand', 'vehicleModel', 'vehicleType', 'registrationNo', 'dailyRent', 'status']
    try {
        const updates = Object.keys(req.body)
        const isValidOperation = updates.every((update) => allowed.includes(update))
        if(!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' })
        }

        if(req.body.registrationNo) {
            const exists = await Vehicle.findOne({ registrationNo : req.body.registrationNo,
                _id : { $ne : req.params.id } 
            })
            if(exists) {
                return res.status(409).json({ message: 'Vehicle with this registration number already exists' })
            }
        }
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if(!updatedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' })
        }
        return res.status(200).json(updatedVehicle)
    }
    catch (error) {
        res.status(500).json({ message: 'Server error, please try again after some time'})
        console.error(error)
    }
}

async function deleteVehicle(req, res) {
    try {
        const vehicleId = req.params.id
        const vehicle = await Vehicle.findById(vehicleId)
        if(!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' })
        }
        await Vehicle.findByIdAndDelete(vehicleId)
        res.json({ message: 'Vehicle deleted successfully' })
    }
    catch (error) {
        res.status(500).json({ message: 'Server error, please try again after some time'})
        console.error(error)
    }
}

module.exports = { addVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle }