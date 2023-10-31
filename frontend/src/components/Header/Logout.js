import React, { useState, useEffect } from 'react';
import { Modal, Button, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Logout({onClose}) {
  const navigate = useNavigate();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    setLogoutModalVisible(true);
  }, []);

  const handleLogout = () => {
    axios
      .post('http://localhost:8000/api/v1/logout')
      .then((res) => {
        message.success(res.data.message);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
    navigate('/login');
    onClose && onClose();  // 登出，关闭弹窗
  };

  const handleCancel = () => {
    setLogoutModalVisible(false);
    onClose && onClose();  // 关闭弹窗后，调用onClose回调
  };

  return (
    <div>
      <Modal
        open={logoutModalVisible}
        title="Logout"
        centered
        icon={<ExclamationCircleOutlined />}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="logout" type="primary" danger onClick={handleLogout}>
            Log out
          </Button>,
        ]}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </div>
  );
}