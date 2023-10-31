import React, { useState, useEffect} from 'react';
import { Button, Input, message, Modal } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupVerify = ({ isOpen, onClose, username, email, password, service }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(60);

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
    axios
      .post('/api/v1/sendMailCode', { email: email, service:service })
      .then((res) => {
        message.success("Verification Code Sent Successfully");
        setCountdown(59); 
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  };
  
  const handleVerificationCodeSubmit = () => {
    axios
      .post('/api/v1/register', {
        username: username,
        email: email,
        password: password,
        code: verificationCode,
      })
      .then((res) => {
        message.success('Registration successful!');
        onClose();
        navigate('/login');
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  };
  const handleCloseModal = () => {
    setVerificationCode('');
    onClose();
  };

  return (
    <Modal
      title="Verify Your Email"
      open={isOpen}
      onCancel={handleCloseModal}
      footer={null}
      centered
      width={500}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '5px', marginTop: '5px', fontSize: '16px' }}>
          Verification Code <span style={{ color: 'red' }}>*</span>
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            placeholder="Enter code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            size="large"
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
          style={{ height: '50px', marginTop: '20px', fontSize: '16px', background: '#222222' }}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default SignupVerify;