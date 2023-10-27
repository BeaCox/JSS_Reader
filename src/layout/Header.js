import React, {useState } from 'react';
import { Layout, Avatar ,Drawer} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ReactComponent as DayIcon } from '../assets/icons/dayicon.svg';
import { ReactComponent as NightIcon } from '../assets/icons/nighticon.svg';
import { ReactComponent as DarkLogo } from '../../src/assets/logo.svg';
import { ReactComponent as LightLogo } from '../../src/assets/logo-light.svg';

import UserProfile from '../components/Header/UserProfile'

import './Sidebar.css';

const { Header: AntHeader } = Layout;

export default function Header({toggleTheme, isDarkMode }) {

  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };
  
  const headerStyle={
    display: 'flex',
    position:'sticky',
    top:'0',
    zIndex:'1',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDarkMode ? '#141414' : 'white', 
    color: isDarkMode ? 'white' : 'black',
    padding: '10px 25px',
    borderBottom: isDarkMode ? '1px solid #262626':'1px solid #dee2e6',
  }

  return (
      <AntHeader theme='light' style={headerStyle}>
        {/* Logo */}
        {isDarkMode ? 
          <LightLogo style={{ width: '50px', height: '50px', marginRight: 'auto' }} />
          :
          <DarkLogo style={{ width: '50px', height: '50px', marginRight: 'auto' }} />
        }

        {isDarkMode ? <DayIcon onClick={toggleTheme} className='theme-icon'/> : 
          <NightIcon onClick={toggleTheme} className='theme-icon' />}

        {/* avatar */}
        <Avatar size="large" icon={<UserOutlined />} onClick={showDrawer} style={{ cursor: 'pointer' }} />

        {/* User Profile Drawer */}
        <Drawer
          title="User Profile"
          placement="right"
          closable={true}
          onClose={onClose}
          style={isDarkMode ? {backgroundColor:"#141414"}:''}
          open={drawerVisible}
          width={256}
        >
        <UserProfile />
        </Drawer>
      </AntHeader>

  );
}