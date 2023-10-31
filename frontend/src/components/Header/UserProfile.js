import { useState } from 'react';
import { Avatar, Divider, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '../../layout/Sidebar.css';
import { ReactComponent as SettingsIcon } from '../../assets/icons/Settings.svg';
import { ReactComponent as HelpIcon } from '../../assets/icons/Help.svg';
import { ReactComponent as FeedbackIcon } from '../../assets/icons/Feedback.svg';
import { ReactComponent as AccounIcon } from '../../assets/icons/Account.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/Logout.svg';
import Logout from './Logout';

import { useAction } from '../../context/actionContext';


export default function UserProfile({avatar, username, email }) {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  const hideLogoutModal = () => {
    setIsLogoutModalVisible(false);
  };

  const { updateAction } = useAction();
  const handleClick = (action) => {
    updateAction(action);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar size={64} icon={<UserOutlined />} src={avatar} />
        <h2>{username}</h2>
        <p>{email}</p>
      </div>

      <Divider style={{marginTop:'2px', marginBottom:'2px'}}/>

      <Menu selectable={false} style={{borderRight:'none'}}>
        <Menu.Item icon={<AccounIcon className='sidebar-icon'/>} style={{display:'flex', alignItems:'center'}}
        onClick={() => handleClick('account')}>
          Account
        </Menu.Item>

        <Menu.Item icon={<LogoutIcon className='sidebar-icon'/>} style={{display:'flex', alignItems:'center'}}
          onClick={showLogoutModal}>
          Log Out
        </Menu.Item>
      </Menu>

      <Divider style={{marginTop:'2px', marginBottom:'2px'}}/>

      <Menu selectable={false} style={{borderRight:'none'}} >
        <Menu.Item icon={<SettingsIcon className='sidebar-icon'/>} style={{display:'flex', alignItems:'center'}} 
        onClick={() => handleClick('settings')}>
          Settings
        </Menu.Item>

        <Menu.Item icon={<HelpIcon className='sidebar-icon'/>} style={{display:'flex', alignItems:'center'}}
        onClick={() => handleClick('help')}>
          Help
        </Menu.Item>

        <Menu.Item icon={<FeedbackIcon className='sidebar-icon'/>} style={{display:'flex', alignItems:'center'}}
        onClick={() => handleClick('feedback')}>
          Feedback
        </Menu.Item>
      </Menu>
      {isLogoutModalVisible && <Logout onClose={hideLogoutModal} />}
    </div>
  );
}

