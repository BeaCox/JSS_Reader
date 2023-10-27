import React, { useState, useEffect } from 'react';
import { Button, Layout, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import logo from '../../../src/assets/logo.svg'

const { Header } = Layout;

const NavBar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 100) setScrolled(true);
            else setScrolled(false);
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <Header style={{ 
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
            position: 'fixed', 
            backdropFilter: scrolled ? 'blur(1px)' : '',
            display:'flex',
            width: '100%', 
            height:'80px',
            boxShadow: scrolled ? '0 0 20px rgba(0, 0, 0, 0.1)' : '',
        
            zIndex: 1000,
            transition: 'background-color 0.3s',
        }}>
           <Row style={{ width: '100%', margin: '0' }} justify="space-between">
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Link to="/" style={{ display: 'inline-block', margin: '0', padding: '0', lineHeight: '0' }}>
                        <img src={logo} alt="JSS Logo" style={{ width: '80px', height: '80px' }} />
                    </Link>
                </Col>
            </Row>
            <Row style={{ width: '100%', margin: '0' }} justify="end" align="middle">
                <Col>
                    <Link to="/login" style={{ marginRight: '10px' }}>
                        <Button type="text" style={{width:'6rem', minHeight:'2.5rem',fontSize:'16px', fontWeight:'bold'}}>Sign In</Button>
                    </Link>
                    <Link to="/register">
                        <Button type="primary" style={{background:'#222222', width:'6rem', minHeight:'2.5rem', fontSize:'16px', fontWeight:'bold'}}>Sign Up</Button>
                    </Link>
                </Col>
            </Row>
        </Header>
    );
}

export default NavBar;
