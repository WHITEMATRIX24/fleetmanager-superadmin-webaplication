import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Logo from '../assets/logo.png';
import Video from '../assets/videoplayback.webm'

const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/dashboard');
    };

    return (
        <div className="home-container">
            <video autoPlay loop muted className="bg-video">
                <source src={Video} type="video/webm" />

                Your browser does not support the video tag.
            </video>
            <div className="content">
                <img src={Logo} alt="Logo" className="logo-h" />
                <button className="dashboard-button-h" onClick={handleClick}>
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Home;
