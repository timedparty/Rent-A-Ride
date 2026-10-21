const User = require('../models/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function register(req, res) {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const phone = req.body.phone;
        const licenseNo = req.body.licenseNo;
        const licenseExpiry = req.body.licenseExpiry;

        const exists = await User.findOne({ email : email });
        if(exists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name : name,
            email : email,
            password : hashedPassword,
            phone : phone,
            licenseNo : licenseNo,
            licenseExpiry : licenseExpiry
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }

    catch (error) {
        res.status(500).json({ message: 'Server error, please try again after some time' })
    }
}

async function login(req, res) {
    try {
        const email = req.body.email
        const password = req.body.password
        if(!email || !password) {
            return res.status(400).json({message : "Both email and password are required"})
        }

        const exists = await User.findOne({ email : email })
        if(!exists) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const match = await bcrypt.compare(password, exists.password)
        if(!match) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: exists._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.json({ token, 
            user: {
                id: exists._id,
                name: exists.name,
                email: exists.email,
                role: exists.role
            }
        })
    } 
    catch (error) {
        res.status(500).json({ message: 'Server error, please try again after some time' })
    }
}

module.exports = { register, login };