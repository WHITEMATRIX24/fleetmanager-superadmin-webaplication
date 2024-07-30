// src/components/TotalDriver.js
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './TotalDriver.css';

const TotalDriver = () => {
    const [drivers, setDrivers] = useState([]);
    const [page, setPage] = useState(1);
    const driversPerPage = 8;

    useEffect(() => {
        fetch('http://localhost:5000/api/drivers')
            .then(response => response.json())
            .then(data => setDrivers(data.drivers))
            .catch(error => console.error('Error fetching drivers:', error));
    }, []);

    const displayedDrivers = drivers.slice(0, page * driversPerPage);

    return (
        <div className="total-drivers">
            <h1>Total Drivers</h1>
            <div className="drivers-list">
                {displayedDrivers.map(driver => (
                    <div key={driver.driverId} className="driver-card">
                        {driver.driverPhoto ? (
                            <img src={`http://localhost:5000/${driver.driverPhoto}`} alt={driver.driverName} className="driver-photo" />
                        ) : (
                            <FaUserCircle className="driver-icon" />
                        )}
                        <h3>{driver.driverName}</h3>
                        <p>ID: {driver.driverId}</p>
                        <p>Licence Expiry Date: {new Date(driver.driverLicenceExpiryDate).toLocaleDateString()}</p>
                        <p>Trips Assigned: {driver.trips.length}</p>
                    </div>
                ))}
            </div>
            {page * driversPerPage < drivers.length && (
                <button className="more-button" onClick={() => setPage(page + 1)}>More</button>
            )}
        </div>
    );
};

export default TotalDriver;
