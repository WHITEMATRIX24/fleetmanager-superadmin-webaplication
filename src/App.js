import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import TotalVehicle from './components/TotalVehicle';
import TotalDriver from './components/TotalDriver';
import Maintenance from './components/Maintenance';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/total-vehicles" element={<TotalVehicle />} />
        <Route path="/total-drivers" element={<TotalDriver />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </Router>
  );
};

export default App;
