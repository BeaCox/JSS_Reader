import React from 'react';
// import { BrowserRouter } from 'react-router-dom';
import { FloatButton } from 'antd';

import Navbar from '../components/Landing/NavBar';
import Banner from '../components/Landing/Banner';
import Slogan from '../components/Landing/Slogan';
import Features from '../components/Landing/Features';
import Team from '../components/Landing/Team';
import Footer from '../components/Landing/Footer';


const LandingPage = () => {
    return (
        <div style={{ height: '300vh'}}>
        <div>
            <Navbar />
            <Banner />
            <Slogan />
            <Features />
            <Team />
            <Footer />
        </div>
            <FloatButton.BackTop />
        </div>
    );
};

export default LandingPage;
