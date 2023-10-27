import React, { useState, useEffect } from "react";
import { Button, Input, message, Modal } from "antd";
import axios from 'axios';

const CancelAccount = ({ isOpen, onClose }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let interval;

    if (countdown > 0 && countdown < 60) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
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
      .post('/api/v1/sendMailCode', { service: 'cancel' })
      .then((res) => {
        message.success(res.data.message);
        setCountdown(59);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  };

  const handleSubmit = () => {
    axios
      .post('/api/v1/cancel', { code: verificationCode })
      .then((res) => {
        message.success('Account cancelled successfully!');
        onClose();
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  };

  return (
    <Modal
      title="Cancel Account"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label
          style={{ marginBottom: "5px", marginTop: "5px", fontSize: "16px" }}
        >
          Verification Code <span style={{ color: "red" }}>*</span>
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Enter code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            size="large"
            style={{ height: "50px", width: "70%", marginRight: "10px" }}
          />
          <Button
            onClick={handleSendVerificationCode}
            type="primary"
            disabled={countdown !== 60}
            style={{ fontSize: "16px", height: "50px", width: "30%" }}
          >
            {countdown === 60 ? "Send Code" : `Resend (${countdown}s)`}
          </Button>
        </div>

        <Button
          type="primary"
          block
          onClick={handleSubmit}
          style={{
            width: "100%",
            height: "50px",
            marginTop: "20px",
            fontSize: "16px",
            background: "#222222",
            borderBottom:'none'
          }}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default CancelAccount;
