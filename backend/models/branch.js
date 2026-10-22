const mongoose = require('mongoose')

const BranchSchema = new mongoose.Schema({
    branchName : {
        type : String,
        required : true,
        trim : true
    },

    address : {
        type : String,
        required : true,
        trim : true
    },

    city : {
        type : String,
        required : true,
        trim : true
    },

    phone : {
        type : String,
        required : true,
        trim : true
    },

    isActive : {
        type : Boolean,
        default : true
    }
},
{
    timestamps : true
})

module.exports = mongoose.model('Branch', BranchSchema, 'branches')