const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
{
    name : {
        type : String,
        required : true,
        trim : true
    },

    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },

    password : {
        type : String, 
        required : true
    },

    phone : {
        type : String,
        required : true,
        trim : true
    },

    role : {
        type : String, 
        enum : ['admin', 'customer'],
        default : 'customer'
    },

    licenseNo : {
        type : String
    },

    licenseExpiry : {
        type : Date
    },
},
{
    timestamps : true
});


module.exports = mongoose.model('User', UserSchema);