const express = require('express')
const {addVehicle, getVehicles} = require('../controllers/vehicleController.js')
const {protect, adminOnly} = require('../middleware/authMiddleware.js')

const router = express.Router()

router.post('/', protect, adminOnly, addVehicle)
router.get('/', getVehicles)

module.exports = router