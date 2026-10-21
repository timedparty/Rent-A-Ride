const express = require('express')
const {addVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle} = require('../controllers/vehicleController.js')
const {protect, adminOnly} = require('../middleware/authMiddleware.js')

const router = express.Router()

router.post('/', protect, adminOnly, addVehicle)
router.patch('/:id', protect, adminOnly, updateVehicle)
router.get('/', getVehicles)
router.get('/:id', getVehicleById)
router.delete('/:id', protect, adminOnly, deleteVehicle)

module.exports = router