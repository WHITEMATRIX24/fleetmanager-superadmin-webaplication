// backend/routes/maintenance.js
const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle');
const WorkshopMovement = require('../models/workshopMovement');

router.get('/maintenance-details/:vehicleNumber', async (req, res) => {
    const { vehicleNumber } = req.params;

    try {
        const vehicle = await Vehicle.findOne({ vehicleNumber });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const lastService = await WorkshopMovement.find({ vehicleNumber }).sort({ workshopVisitDate: -1 }).limit(1);
        const lastServiceDate = lastService.length ? lastService[0].workshopVisitDate : 'N/A';

        const tireChange = await WorkshopMovement.find({ vehicleNumber, complaintDetail: 'Tyre Change' }).sort({ workshopVisitDate: -1 }).limit(1);
        const nextTireChange = tireChange.length ? tireChange[0].nextTyreChange - (vehicle.odometerReading - tireChange[0].odometerReading) : 'N/A';

        const oilChange = await WorkshopMovement.find({ vehicleNumber, complaintDetail: 'Oil Change' }).sort({ workshopVisitDate: -1 }).limit(1);
        const nextOilChange = oilChange.length ? oilChange[0].nextOilChange - (vehicle.odometerReading - oilChange[0].odometerReading) : 'N/A';

        const serviceHistory = await WorkshopMovement.find({ vehicleNumber }).sort({ workshopVisitDate: -1 });

        res.json({
            details: {
                lastServiceDate,
                nextTireChange,
                nextOilChange,
            },
            history: serviceHistory,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching maintenance details', error });
    }
});

module.exports = router;
