import React from 'react';
import { Button } from 'antd';
import { Parallax } from 'react-scroll-parallax';
import screenshotLight from '../../assets/image/screenshotlight.jpg';
import {ArrowRightOutlined} from '@ant-design/icons'
import { Link } from 'react-router-dom';

const Banner = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '85vh',
            // background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
            background: '#ffffff',
            padding: '50px 0'
        }}>
            <Parallax y={[-20, 20]} tagOuter="figure">
                <h1 style={{ fontSize: '64px', color: '#000', marginTop:'300px',marginBottom:'0', }}>
                    JSS Reader</h1>
            </Parallax>
            <p style={{ fontSize: '20px', color: '#919191', margin: '15px 0' }}>
                An Information Aggregation Platform Designed for SJTUer</p>
            <Link to="/register">
                <Button type="primary" style={{background:'#222222', width:'10rem', minHeight:'2.5rem',
                    fontSize:'18px',fontWeight:'bold',margin:'20px 0', boxShadow: '0px 4px 4px 0px #919191'}}
                    icon={<ArrowRightOutlined/>} >Get Started</Button>
            </Link>
            <img 
                src={screenshotLight} alt="Product Screenshot" 
                style={{minHeight:'36rem', minWidth: '52rem', boxShadow: '10px 10px 10px 10px rgba(0, 0, 0, 0.1)', 
                marginTop: '20px' }} />
        </div>
    );
}

export default Banner;
