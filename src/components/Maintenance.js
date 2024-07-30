import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Maintenance.css'; // Import the new CSS file

const Maintenance = () => {
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [maintenanceDetails, setMaintenanceDetails] = useState(null);
    const [serviceHistory, setServiceHistory] = useState([]);
    const [error, setError] = useState(null);
    const [vehicleData, setVehicleData] = useState([]);

    const fetchDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/maintenance-details/${vehicleNumber}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setMaintenanceDetails(data.details);
            setServiceHistory(data.history);
        } catch (error) {
            console.error('Error fetching maintenance details:', error);
            setError(error.message);
        }
    };

    const fetchVehicleData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/vehicles');
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            const vehicleTypeCounts = data.vehicles.reduce((acc, vehicle) => {
                acc[vehicle.vehicleType] = (acc[vehicle.vehicleType] || 0) + 1;
                return acc;
            }, { SUV: 0, MPV: 0, Sedan: 0, Luminous: 0 });

            const formattedData = Object.keys(vehicleTypeCounts).map(type => ({
                name: type,
                count: vehicleTypeCounts[type],
            }));

            setVehicleData(formattedData);
        } catch (error) {
            console.error('Error fetching vehicle data:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchVehicleData();
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();
        const year = date.getUTCFullYear();
        return `${day} ${month} ${year}`;
    };

    return (
        <div className="maintenance-container">
            <h1 className="maintenance-header">Maintenance Details</h1>
            <div className="maintenance-input-container">
                <input
                    type="text"
                    className="maintenance-input"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="Enter Vehicle Number"
                />
                <button className="maintenance-button" onClick={fetchDetails}>Get Details</button>
            </div>

            {error && <p className="maintenance-error">Error: {error}</p>}

            <div className="card-container">
                {maintenanceDetails && (
                    <div className="maintenance-card">
                        <div className="card-title">Last Service Date</div>
                        <div className="card-content">{formatDate(maintenanceDetails.lastServiceDate)}</div>
                    </div>
                )}
                {maintenanceDetails && (
                    <div className="maintenance-card">
                        <div className="card-title">Next Tire Change in Kilometers</div>
                        <div className="card-content">{maintenanceDetails.nextTireChange}</div>
                    </div>
                )}
                {maintenanceDetails && (
                    <div className="maintenance-card">
                        <div className="card-title">Next Oil Change in Kilometers</div>
                        <div className="card-content">{maintenanceDetails.nextOilChange}</div>
                    </div>
                )}
            </div>

            {serviceHistory.length > 0 && (
                <div className="performance-metrics-container">
                    <div className="performance-metrics-header">
                        <h2>Service History</h2>
                    </div>
                    <table className="service-history-table">
                        <thead>
                            <tr>
                                <th>Workshop Visit Date</th>
                                <th>Complaint Detail</th>
                                <th>No of Days Spent</th>
                                <th>Amount Spent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviceHistory.map((visit, index) => (
                                <tr key={index}>
                                    <td>{formatDate(visit.workshopVisitDate)}</td>
                                    <td>{visit.complaintDetail}</td>
                                    <td>{visit.noOfDays}</td>
                                    <td>{visit.amountSpent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


        </div>
    );
};

export default Maintenance;
