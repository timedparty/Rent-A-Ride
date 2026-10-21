const mongoose = require('mongoose')

const VehicleSchema = new mongoose.Schema({
    vehicleBrand : {
        type : String,
        required : true,
        trim : true
    }, 

    vehicleModel : {
        type : String,
        required : true,
        trim : true
    },

    vehicleType : {
        type : String,
        required : true,
        enum : ['car', 'bike']
    },

    registrationNo : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },

    dailyRent : {
        type : Number,
        required : true,
        min : 0
    },

    status : {
        type : String,
        enum : ['available', 'rented', 'unavailable'],
        default : 'available'
    },
},
{
    timestamps : true
})

module.exports = mongoose.model('Vehicle', VehicleSchema, 'vehicles')