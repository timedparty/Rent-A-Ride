const User = require('../models/user.js')
const bcrypt = require('bcryptjs');

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
        res.status(500).json({ message: 'Server error, please try again after some time' });
    }
}

module.exports = { register };