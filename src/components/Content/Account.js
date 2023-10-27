import React, { useState, useEffect } from "react";
import { Card, Avatar, Input, Button, message } from "antd";
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  SaveOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import ChangePwd from "../../services/ChangePwd";
import ChangeEmail from "../../services/ChangeEmail";
import axios from 'axios';
import CancelAccount from "../../services/CancelAccount";

function Account() {
  const [isEditingNickname, setEditingNickname] = useState(false);
  const [isPwdModalVisible, setPwdModalVisible] = useState(false);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [accountId, setAccountId] = useState("");
  const [tempNickname, setTempNickname] = useState('');

  useEffect(() => {
    axios.get('/api/v1/user', { withCredentials: true })
      .then(response => {
        const { id, username, email } = response.data;
        setAccountId(id);
        setNickname(username);
        setEmail(email);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        message.error('Failed to load user data!');
      });
  }, []);

  const handleEmailEditClick = () => {
    setEmailModalVisible(true);
  };

  const handleEmailCancel = () =>{
    setEmailModalVisible(false);
  }

  const handlePwdChange = () => {
    setPwdModalVisible(true);
  };

  const handlePwdCancel = () => {
      setPwdModalVisible(false);
    };

  const handleCancelAccount = () => {
    setCancelModalVisible(true);
  };

  const handleAccountCancel = () => {
    setCancelModalVisible(false);
  };


  const toggleEditingNickname = () => {
    if (isEditingNickname) {
        setTempNickname(''); // Reset tempNickname if cancel editing
    } else {
        setTempNickname(nickname); // Set the tempNickname before editing
    }
    setEditingNickname(!isEditingNickname);
};

  const saveNickname = () => {
    axios.post('/api/v1/changeUsername', {
        newUsername: tempNickname,
    })
    .then((res) => {
        const { username } = res.data;
        console.log("update name to:"+ username);
        setNickname(username);
        message.success('Username updated successfully!');
        toggleEditingNickname();
    })
    .catch((error) => {
        console.error(error);
        message.error('Failed to update username!');
    });
};

  return (
    <div style={{ padding: "2rem 3rem" }}>
      <Card
        title="Profile"
        style={{
          marginBottom: "3rem",
          borderRadius: "20px",
          textAlign: "left",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
        >
          <Avatar
            size={100}
            icon={<UserOutlined />}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: "18px" }}>
              <span style={{ fontWeight: "bold" }}>ID: </span>
              {accountId}
            </span>
          </div>
          {isEditingNickname ? (
            <div>
              <span style={{ fontSize: "18px" }}>
                <span style={{ fontWeight: "bold" }}>Name: </span>{" "}
              </span>
              <Input
                  value={tempNickname}
                  style={{ width: "30rem" }}
                  onChange={(e) => setTempNickname(e.target.value)}
                  prefix={
                      <EditOutlined
                          onClick={toggleEditingNickname}
                          style={{ cursor: "pointer" }}
                      />
                  }
              />
              <Button
                icon={<SaveOutlined />}
                onClick={saveNickname}
                style={{ marginLeft: 10 }}
              >
                Save
              </Button>
            </div>
          ) : (
            <div onClick={toggleEditingNickname}>
              <span style={{ fontSize: "18px" }}>
                <span style={{ fontWeight: "bold" }}>Name: </span>
                {nickname}{" "}
                <EditOutlined style={{ marginLeft: 8, cursor: "pointer" }} />
              </span>
            </div>
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <span style={{ fontSize: "18px" }}>
            <span style={{ fontWeight: "bold" }}>Email: </span> {email}
            <EditOutlined
              onClick={handleEmailEditClick}
              style={{ marginLeft: 8, cursor: "pointer" }}
            />
          </span>
        </div>
      </Card>

      <Card
        title="Security"
        style={{
          marginBottom: "3rem",
          borderRadius: "20px",
          textAlign: "left",
        }}
      >
        <Button icon={<LockOutlined />} onClick={handlePwdChange}>
          Change Password
        </Button>
        <br></br><br></br>
        <Button style={{color:'red',borderColor:'red'}} icon={<DeleteOutlined />} onClick={handleCancelAccount}>
        Cancel your account
        </Button>
      </Card>

      <ChangePwd
        isOpen={isPwdModalVisible}
        onClose={handlePwdCancel}
      />

      <ChangeEmail
        isOpen={isEmailModalVisible}
        onClose={handleEmailCancel}
      />

      <CancelAccount
        isOpen={isCancelModalVisible}
        onClose={handleAccountCancel}
      />
    </div>
  );
}

export default Account;
