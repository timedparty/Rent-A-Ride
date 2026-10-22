const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.js');
const vehicleRoutes = require('./routes/vehicleRoutes.js');
const branchRoutes = require('./routes/branchRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/bookings', bookingRoutes)
const PORT = process.env.PORT

app.get('/', (req, res) => {
        res.send('Server is running')
})


const startServer = async () => {
    await connectDB()

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

startServer();