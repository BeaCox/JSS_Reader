import React, { useState, useEffect } from 'react';
import { Button, Input, message, Modal } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePwd = ({ isOpen, onClose, onChangePassword }) => {
    const [newPassword2, setNewPassword2] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [countdown, setCountdown] = useState(60);
    const navigate = useNavigate();

    useEffect(() => {
        let interval;

        if (countdown > 0 && countdown < 60) {
            interval = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            clearInterval(interval);
            setCountdown(60);
        }

        return () => {
            clearInterval(interval);
        };
    }, [countdown]);

    const handleSendVerificationCode = () => {
        if (!newPassword) { message.error("Please input your password") }
        else if (newPassword !== newPassword2) { message.error("Please check whether the two passwords are the same") }
        else {
            axios
                .post('/api/v1/sendMailCode', { service: 'changePassword'})
                .then((res) => {
                    message.success("Verification Code Sent Successfully");
                    setCountdown(59); // 只有在成功发送验证码后才开始倒计时
                })
                .catch((error) => {
                    message.error(error.response.data.message);
                });
        }
    };

    const handleVerificationCodeSubmit = () => {

        axios
            .post('/api/v1/changePassword', {
                code: verificationCode,
                newPassword: newPassword,
            })
            .then((res) => {
                message.success('Successful password change');
                onClose();
                navigate('/login');
            })
            .catch((error) => {
                message.error(error.response.data.message);
            });
    };

    return (
        <Modal
            title="Change Password"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={500}
        >
            <div style={{ display: 'flex', flexDirection: 'column' }}>

                <label style={{ marginBottom: '5px', marginTop: '5px', fontSize: '16px' }}>New Password <span style={{ color: 'red' }}>*</span></label>
                <Input.Password
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    size='large'
                    style={{ height: '50px', marginBottom: '10px' }}
                />

                <label style={{ marginBottom: '5px', marginTop: '5px', fontSize: '16px' }}>Confirm New Password <span style={{ color: 'red' }}>*</span></label>
                <Input.Password
                    placeholder="Enter your new password again"
                    value={newPassword2}
                    onChange={(e) => setNewPassword2(e.target.value)}
                    size='large'
                    style={{ height: '50px', marginBottom: '10px' }}
                />

                <label style={{ marginBottom: '5px', marginTop: '5px', fontSize: '16px' }}>Verification Code <span style={{ color: 'red' }}>*</span></label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Input
                        placeholder="Enter code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        size='large'
                        style={{ height: '50px', width: '70%', marginRight: '10px' }}
                    />
                    <Button
                        onClick={handleSendVerificationCode}
                        type="primary"
                        disabled={countdown !== 60}
                        style={{ fontSize: '16px', height: '50px', width: '30%' }}
                    >
                        {countdown === 60 ? "Send Code" : `Resend (${countdown}s)`}
                    </Button>
                </div>

                <Button
                    type="primary"
                    block
                    onClick={handleVerificationCodeSubmit}
                    style={{ width: '100%', height: '50px', marginTop: '20px', fontSize: '16px', background: '#222222' }}
                >
                    Change Password
                </Button>
            </div>
        </Modal>
    );
}

export default ChangePwd;
