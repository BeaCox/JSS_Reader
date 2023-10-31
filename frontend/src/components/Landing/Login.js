import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Divider, Input, message } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import Navbar from './NavBar';
import ForgetPwd from '../../services/ForgetPwd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

    const handleLogin = () => {
        // 格式验证
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (isValid) {
          if (!email || !emailRegex.test(email)) {
            const updatedError = { ...error, email: 'Please enter a valid email address.' };
            setError(updatedError);
            isValid = false;
            message.error(updatedError.email);
          } else {
            const updatedError = { ...error, email: 'Something wrong happened, please check your input and click again.' };
            setError(updatedError);
          }
        }
    
        if (isValid) {
          if (!password) {
            const updatedError = { ...error, password: 'Please enter a password.' };
            setError(updatedError);
            isValid = false;
            message.error(updatedError.password);
          } else {
            const updatedError = { ...error, password: 'Something wrong happened, please check your input and click again.' };
            setError(updatedError);
          }
        }

        if (isValid) {
            axios
            .post('/api/v1/login', { email: email, password: password })
            .then((response) => {
                console.log(response.data);
                message.success('Login successful!');
                navigate('/home')
            })
            .catch((error) => {
                console.error(error);
                message.error(error.response.data.message); // 显示后端解析来的提示信息
            });
            setError({
                email: '',
                password: '',
            });
        }
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            console.log("User is likely logged in");
        } else {
            console.log("User is not logged in");
        }

    };

    useEffect(() => {
        let interval;

        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [countdown]);

    return (
        <div>
            <Navbar />
            <div className="login-main" style={{ padding: '5% 15%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '45px', marginBottom: '0' }}>Welcome back.</h2>
                <h2 style={{ fontSize: '45px', marginTop: '0' }}>We exist to make reading easier.</h2>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <div style={{
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        boxShadow: '0 0 12px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '40px',
                        width: '400px'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', marginBottom: '20px' }}>
                            <label style={{ marginBottom: '5px' }}>Email <span style={{ color: 'red' }}>*</span></label>
                            <Input size='large' placeholder="Enter your email" style={{ height: '50px' }} value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <label style={{ marginBottom: '5px' }}>Password <span style={{ color: 'red' }}>*</span></label>
                                <span style={{ textDecoration: 'none', color: 'blue', cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                    onClick={() => setShowForgotPasswordModal(true)}>
                                    Forgot your password?
                                </span>
                            </div>
                            <Input.Password size='large' placeholder="Enter your password" style={{ width: '100%', height: '50px', marginTop: '5px' }} value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }} />
                        </div>

                        <Button
                            style={{ width: '100%', height: '50px', marginBottom: '5px', fontSize: '16px' }}
                            type="primary"
                            block
                            onClick={handleLogin}
                        >
                            Sign in
                        </Button>

                        <Divider style={{ width: '380px', color: '#8c8c8c' }}>Or</Divider>

                        <Button type="primary" block icon={<GithubOutlined />}
                            style={{
                                backgroundColor: 'black', borderColor: 'black', width: '100%', height: '50px',
                                marginBottom: '15px', fontSize: '16px'
                            }}>
                            Sign in with Github
                        </Button>

                        <p>Don't you have an account?
                            <Link
                                to="/register"
                                style={{ color: 'blue', textDecoration: 'none', marginLeft: '10px' }}
                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <ForgetPwd
                isOpen={showForgotPasswordModal}
                onClose={() => setShowForgotPasswordModal(false)}
                onVerificationSubmit={(email, code) => {
                    // 此处处理验证逻辑
                }}
            />

        </div>
    );
}

export default Login;
