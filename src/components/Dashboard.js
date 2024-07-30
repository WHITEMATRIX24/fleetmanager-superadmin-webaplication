import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, defs, linearGradient, stop } from 'recharts';
import { FaHome, FaCar, FaUser, FaWrench, FaPeopleRoof, } from 'react-icons/fa';
import './Dashboard.css';
import Logo from '../assets/logo.png';

const Dashboard = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [tripData, setTripData] = useState([]);
    const [totalVehicles, setTotalVehicles] = useState(0);
    const [totalDrivers, setTotalDrivers] = useState(0);
    const [vehicleTypeData, setVehicleTypeData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [managerId, setManagerId] = useState('');
    const [managerName, setManagerName] = useState('');
    const [managerPassword, setManagerPassword] = useState('');
    const [managerPhoneNumber, setManagerPhoneNumber] = useState('');
    const navigate = useNavigate();
    const [totalManagers, setTotalManagers] = useState(0);
    const [showSidebar, setShowSidebar] = useState(false);
    useEffect(() => {
        fetch('http://localhost:5000/api/revenue')
            .then(response => response.json())
            .then(data => {
                const formattedData = Object.keys(data).map(key => ({ name: key, revenue: data[key] }));
                setRevenueData(formattedData);
            })
            .catch(error => console.error('Error fetching revenue data:', error));

        fetch('http://localhost:5000/api/trip-statistics')
            .then(response => response.json())
            .then(data => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const formattedData = months.map(month => ({
                    name: month,
                    trips: data[month] || 0
                }));
                setTripData(formattedData);
            })
            .catch(error => console.error('Error fetching trip statistics:', error));

        fetch('http://localhost:5000/api/total-vehicles')
            .then(response => response.json())
            .then(data => setTotalVehicles(data.totalVehicles))
            .catch(error => console.error('Error fetching total vehicles:', error));

        fetch('http://localhost:5000/api/total-drivers')
            .then(response => response.json())
            .then(data => setTotalDrivers(data.totalDrivers))
            .catch(error => console.error('Error fetching total drivers:', error));

        fetch('http://localhost:5000/api/vehicles')
            .then(response => response.json())
            .then(data => {
                const vehicleTypeCounts = data.vehicles.reduce((acc, vehicle) => {
                    acc[vehicle.vehicleType] = (acc[vehicle.vehicleType] || 0) + 1;
                    return acc;
                }, { SUV: 0, MPV: 0, Sedan: 0, Luminous: 0 });

                const formattedData = Object.keys(vehicleTypeCounts).map(type => ({
                    name: type,
                    count: vehicleTypeCounts[type],
                }));

                setVehicleTypeData(formattedData);
            })
            .catch(error => console.error('Error fetching vehicle data:', error));
        fetch('http://localhost:5000/api/total-managers')
            .then(response => response.json())
            .then(data => setTotalManagers(data.totalManagers))
            .catch(error => console.error('Error fetching total managers:', error));
    }, []);

    const handleGenerateId = () => {
        fetch('http://localhost:5000/generate-manager-id')
            .then(response => response.json())
            .then(data => setManagerId(data.managerId))
            .catch(error => console.error('Error generating manager ID:', error));
    };

    const handleSubmit = () => {
        const managerData = {
            managerName,
            managerUsername: managerId,
            managerPassword,
            managerPhoneNumber
        };

        fetch('http://localhost:5000/add-manager', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(managerData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Manager added:', data);
                setShowPopup(false);
            })
            .catch(error => console.error('Error adding manager:', error));
    };

    const navigateToTotalVehicles = () => {
        navigate('/total-vehicles');
    };

    const navigateToTotalDrivers = () => {
        navigate('/total-drivers');
    };

    const navigateToMaintenance = () => {
        navigate('/maintenance');
    };
    const CustomizedBar = (props) => {
        const { x, y, width, height, fill } = props;
        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fill}
                cursor="default"
                className="custom-bar"
            />
        );
    };
    const toggleSidebar = () => {
        if (window.innerWidth <= 768) {
            setShowSidebar(!showSidebar);
        }
    };
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <img src={Logo} alt="Logo" className="logo" onClick={toggleSidebar} />
                <h2>Welcome to fleet manager</h2>
            </header>
            <div className="dashboard-content">
                <aside className="sidebar">

                    <div className="sidebar-item" onClick={() => navigate('/')}>
                        <FaHome className="sidebar-icon" />
                    </div>
                    <div className="sidebar-item" onClick={navigateToTotalVehicles}>
                        <FaCar className="sidebar-icon" />
                    </div>
                    <div className="sidebar-item" onClick={navigateToTotalDrivers}>
                        <FaUser className="sidebar-icon" />
                    </div>
                    <div className="sidebar-item" onClick={navigateToMaintenance}>
                        <FaWrench className="sidebar-icon" />
                    </div>
                </aside>
                <main className="main-content">
                    <div className="left-panel">
                        <div className="chart-row">
                            <div className="performance-metrics">
                                <div className="legend">
                                    <h2>Car Revenue Performance</h2>
                                </div>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={revenueData} barSize={30}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#909090" />
                                                    <stop offset="100%" stopColor="#606060" />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" color="black" />
                                            <YAxis />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'transparent', border: 'none' }}
                                                cursor={{ fill: 'transparent' }}
                                            />
                                            <Legend fill="black" />
                                            <Bar dataKey="revenue" fill="url(#colorRevenue)" shape={<CustomizedBar />} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="performance-metrics">
                                <div className='legend'>
                                    <h2>Monthly Trip Statistics</h2>
                                </div>
                                <div className='chart-container'>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={tripData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip contentStyle={{ backgroundColor: 'transparent', border: 'none' }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="trips" stroke="#fff" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-panel">
                        <div className="dashboard-card" onClick={navigateToTotalVehicles}>
                            <div className="card-header">
                                <FaCar className="card-icon" />
                                <p>{totalVehicles} Total</p>
                            </div>
                            <p className="card-title">VEHICLES</p>
                            <button className="view-button">
                                VIEW <span className="arrow">&rarr;</span>
                            </button>
                        </div>
                        <div className="dashboard-card" onClick={navigateToTotalDrivers}>
                            <div className='card-header'>
                                <FaUser className="card-icon" />
                                <p>{totalDrivers} Drivers</p>
                            </div>
                            <p className='card-title'>On Board</p>
                            <button className="view-button">
                                VIEW <span className="arrow">&rarr;</span>
                            </button>
                        </div>
                        <div className="dashboard-card" onClick={navigateToMaintenance}>
                            <div className="card-header">
                                <FaWrench className="card-icon" />
                                <p>Maintenance</p>
                            </div>
                            <p className='card-title'>History</p>
                            <button className="view-button">
                                VIEW <span className="arrow">&rarr;</span>
                            </button>
                        </div>
                        <div className="dashboard-card" onClick={() => setShowPopup(true)}>
                            <div className="card-header">
                                <FaUser className="card-icon" />
                                <p>{totalManagers} Managers</p>
                            </div>
                            <p className='card-title'>On Board</p>
                            <button className="view-button">
                                ADD NEW <span className="arrow">&rarr;</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Popup Form */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-button" onClick={() => setShowPopup(false)}>
                            &times;
                        </button>
                        <h2>Add Manager</h2>
                        <form className="popup-form" onSubmit={handleSubmit}>
                            <label>Name</label>
                            <input
                                type="text"
                                value={managerName}
                                onChange={(e) => setManagerName(e.target.value)}
                                required
                            />
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={managerPhoneNumber}
                                onChange={(e) => setManagerPhoneNumber(e.target.value)}
                                required
                            />
                            <label>Password</label>
                            <input
                                type="password"
                                value={managerPassword}
                                onChange={(e) => setManagerPassword(e.target.value)}
                                required
                            />
                            <label>ID</label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    value={managerId}
                                    onChange={(e) => setManagerId(e.target.value)}
                                    required
                                    style={{ flex: '1' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateId}
                                    style={{ marginLeft: '10px', padding: '10px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}
                                >
                                    Generate
                                </button>
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Dashboard;
