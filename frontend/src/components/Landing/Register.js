import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Divider, Input, message } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import Navbar from './NavBar';
import SignupVerify from '../../services/SignupVerify';

const Register = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    
      const handleSignUp = () => {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!username || !/^[a-zA-Z0-9]{4,12}$/.test(username)) {
          const updatedError = { ...error, username: 'Username must be 4 to 12 characters long and consist of letters and numbers.' };
          setError(updatedError);
          isValid = false;
          message.error(updatedError.username);
        } else {
          const updatedError = { ...error, username: 'Something wrong happened, please check your input and click again.' };
          setError(updatedError);
        }
    
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
          if (password !== confirmPassword) {
            const updatedError = { ...error, confirmPassword: 'Passwords do not match.' };
            setError(updatedError);
            isValid = false;
            message.error(updatedError.confirmPassword);
          } else {
            const updatedError = { ...error, confirmPassword: 'Something wrong happened, please check your input and click again.' };
            setError(updatedError);
          }
        }
    
        if (isValid) {
          setModalOpen(true);
          setError({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
        }
      };

    return (
        <div>
            <Navbar />
            <div className="register-main" style={{ padding: '5% 15%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '45px', marginBottom: '0' }}>Welcome.</h2>
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
                            <label style={{ marginBottom: '5px' }}>Name <span style={{ color: 'red' }}>*</span></label>
                            <Input size='large' placeholder="Enter your name" style={{ height: '50px' }} value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    // 清空错误提示
                                    setError(prevState => ({ ...prevState, username: '' }));
                                }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', marginBottom: '20px' }}>
                            <label style={{ marginBottom: '5px' }}>Email <span style={{ color: 'red' }}>*</span></label>
                            <Input size='large' placeholder="Enter your email" style={{ height: '50px' }} value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    // 清空错误提示
                                    setError(prevState => ({ ...prevState, email: '' }));
                                }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', marginBottom: '20px' }}>
                            <label style={{ marginBottom: '5px' }}>Password <span style={{ color: 'red' }}>*</span></label>
                            <Input.Password size='large' placeholder="Enter your password" style={{ height: '50px' }} value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    // 清空错误提示
                                    setError(prevState => ({ ...prevState, password: '' }));
                                }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', marginBottom: '20px' }}>
                            <label style={{ marginBottom: '5px' }}>Confirm Password <span style={{ color: 'red' }}>*</span></label>
                            <Input.Password size='large' placeholder="Confirm your password" style={{ height: '50px' }}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    // 清空错误提示
                                    setError(prevState => ({ ...prevState, confirmPassword: '' }));
                                }} />
                        </div>

                        <Button style={{ width: '100%', height: '50px', marginBottom: '5px', fontSize: '16px' }}
                            type="primary" block onClick={handleSignUp}>Sign up</Button>
                        <SignupVerify
                            isOpen={isModalOpen}
                            onClose={() => setModalOpen(false)}
                            username = {username}
                            email = {email}
                            password= {password}
                            service ={"register"}
                        />
                        <Divider style={{ width: '380px', color: '#8c8c8c' }}>Or</Divider>

                        <Button type="primary" block icon={<GithubOutlined />}
                            style={{
                                backgroundColor: 'black', borderColor: 'black', width: '100%', height: '50px',
                                marginBottom: '15px', fontSize: '16px'
                            }}>
                            Continue with Github
                        </Button>

                        <p>Already using JSS?
                            <Link
                                to="/login"
                                style={{ color: 'blue', textDecoration: 'none', marginLeft: '10px' }}
                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
