const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Vehicle = require('./models/vehicle');
const Trip = require('./models/trip');
const Driver = require('./models/driver');
const Manager = require('./models/manager');
const maintenanceRoutes = require('./routes/workshopMovements');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const dbUri = process.env.MONGO_URI || 'mongodb+srv://anulisba:aCZHjI8NyQLOHV2d@fleetmanager.mdvsoan.mongodb.net/?retryWrites=true&w=majority&appName=fleetmanager';
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api', maintenanceRoutes);

app.get('/api/revenue', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        const trips = await Trip.find();

        const revenueByType = {
            SUV: 0,
            MPV: 0,
            Sedan: 0,
            Limousine: 0,
        };

        trips.forEach(trip => {
            const vehicle = vehicles.find(v => v.vehicleNumber === trip.vehicleNumber);
            if (vehicle) {
                revenueByType[vehicle.vehicleType] += trip.tripRemunaration || 0;
            }
        });

        res.json(revenueByType);
    } catch (error) {
        console.error('Error fetching revenue data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/trip-statistics', async (req, res) => {
    try {
        const trips = await Trip.find();

        const tripStatistics = {};

        trips.forEach(trip => {
            const month = new Date(trip.tripDate).toLocaleString('default', { month: 'short' });
            if (!tripStatistics[month]) {
                tripStatistics[month] = 0;
            }
            tripStatistics[month]++;
        });

        res.json(tripStatistics);
    } catch (error) {
        console.error('Error fetching trip statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/total-vehicles', async (req, res) => {
    try {
        const totalVehicles = await Vehicle.countDocuments();
        res.json({ totalVehicles });
    } catch (err) {
        console.error('Error fetching total vehicles:', err);
        res.status(500).json({ error: 'Failed to fetch total vehicles' });
    }
});

app.get('/api/total-drivers', async (req, res) => {
    try {
        const totalDrivers = await Driver.countDocuments();
        res.json({ totalDrivers });
    } catch (err) {
        console.error('Error fetching total drivers:', err);
        res.status(500).json({ error: 'Failed to fetch total drivers' });
    }
});
app.get('/api/total-managers', async (req, res) => {
    try {
        const totalManagers = await Manager.countDocuments();
        res.json({ totalManagers });
    } catch (err) {
        console.error('Error fetching total managers:', err);
        res.status(500).json({ error: 'Failed to fetch total managers' });
    }
});

app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json({ vehicles });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching vehicles' });
    }
});

app.get('/generate-manager-id', async (req, res) => {
    try {
        const count = await Manager.countDocuments();
        const managerId = `MGR${String(count).padStart(3, '0')}`;
        res.json({ managerId });
    } catch (error) {
        res.status(500).json({ error: 'Error generating manager ID' });
    }
});

app.post('/add-manager', async (req, res) => {
    try {
        const { managerName, managerUsername, managerPassword } = req.body;
        const newManager = new Manager({ managerName, managerUsername, managerPassword });
        await newManager.save();
        res.json({ message: 'Manager added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding manager' });
    }
});

app.get('/api/drivers', async (req, res) => {
    try {
        const drivers = await Driver.find().populate('trips');
        res.json({ drivers });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching drivers' });
    }
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
