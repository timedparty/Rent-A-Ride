const Branch = require('../models/branch.js')
const mongoose = require('mongoose')

async function createBranch(req, res) {
    try {
        const { branchName, address, city, phone } = req.body
        if(!branchName || !address || !city || !phone) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const exists = await Branch.findOne({ branchName : branchName })
        if(exists) {
            return res.status(409).json({ message: 'Branch already exists' })
        }
        const newBranch = new Branch({
            branchName : branchName,
            address : address,
            city : city,
            phone : phone
        })
        await newBranch.save()
        res.status(201).json({ message: 'Branch created successfully', branch: newBranch })
    }
    catch (error) {
        res.status(500).json({ message: 'Server error, please try again after some time'})
        console.error(error)
    }
}

async function getBranches(req, res) {
    try {
        const branches = await Branch.find({isActive : true}).sort({ city: 1, branchName: 1})
        res.status(200).json(branches)
    }

    catch (error) {
        res.status(500).json({ message: 'Server error, please try again after some time'})
        console.error(error)
    }
}

async function updateBranch(req, res) {
    const allowed = ['branchName', 'address', 'city', 'phone', 'isActive']
    try {
        const updates = Object.keys(req.body)
        if(updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' })
        }
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid branch ID' })
        }
        const validUpdate = updates.every(
            field => allowed.includes(field)
        )
        if(!validUpdate) {
            return res.status(400).json({ message: 'Invalid fields in request body' })
        }
        const { branchName, address, city, phone } = req.body
        const updatedBranch = await Branch.findByIdAndUpdate(
            req.params.id,
            req.body,
        { new: true, runValidators: true})
        
        if(!updatedBranch) {
            return res.status(404).json({ message: 'Branch not found' })
        }
        res.status(200).json({ message: 'Branch updated successfully', branch: updatedBranch })
    }

    catch (error) {
        res.status(500).json({ message: 'Server error, please try again after some time'})
        console.error(error)
    }
}

async function deleteBranch(req, res) {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid branch ID' })
        }
        const deletedBranch = await Branch.findByIdAndDelete(req.params.id)
        if(!deletedBranch) {
            return res.status(404).json({ message: 'Branch not found' })
        }
        res.status(200).json({ message: 'Branch deleted successfully', branch: deletedBranch })
    }

    catch (error) {
        res.status(500).json({ message: 'Server error, please try again after some time'})
        console.error(error)
    }
}

module.exports = { createBranch, getBranches, updateBranch, deleteBranch }