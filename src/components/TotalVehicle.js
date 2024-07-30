// src/components/TotalVehicle.js
import React, { useEffect, useState } from 'react';
import './TotalVehicle.css';

const TotalVehicle = () => {
    const [vehicles, setVehicles] = useState([]);
    const [visibleVehicles, setVisibleVehicles] = useState(8); // State to manage visible vehicles

    useEffect(() => {
        fetch('http://localhost:5000/api/vehicles')
            .then(response => response.json())
            .then(data => {
                if (data.vehicles && Array.isArray(data.vehicles)) {
                    setVehicles(data.vehicles);
                } else {
                    console.error('Expected an array of vehicles, but received:', data);
                }
            })
            .catch(error => console.error('Error fetching vehicles:', error));
    }, []);

    const getImageSrc = (image) => {
        if (!image) return '';
        if (image.startsWith('uploads\\') || image.startsWith('uploads/')) {
            return `http://localhost:5000/${image.replace(/\\/g, '/')}`;
        } else {
            return `data:image/png;base64,${image}`;
        }
    };

    const loadMoreVehicles = () => {
        setVisibleVehicles(prev => prev + 8); // Increase visible vehicles by 8 to maintain 4x2 grid
    };

    return (
        <div className="total-vehicle">
            <h1>Total Vehicles</h1>
            <div className="vehicle-grid">
                {vehicles.slice(0, visibleVehicles).map(vehicle => (
                    <div key={vehicle.vehicleNumber} className="vehicle-card">
                        <img
                            className="vehicle-photo"
                            src={getImageSrc(vehicle.vehiclePhoto)}
                            alt={vehicle.vehicleNumber}
                        />
                        <div className="vehicle-info">
                            <p>CAR NAME: {vehicle.vehicleName}</p>
                            <p>CAR NUMBER: {vehicle.vehicleNumber}</p>
                            <p>CAR TYPE: {vehicle.vehicleType}</p>
                        </div>
                    </div>
                ))}
            </div>
            {visibleVehicles < vehicles.length && (
                <button onClick={loadMoreVehicles} className="load-more-button">More</button>
            )}
        </div>
    );
};

export default TotalVehicle;
