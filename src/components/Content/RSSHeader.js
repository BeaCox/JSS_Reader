import React from 'react';
import {Button, Menu, Dropdown} from 'antd';
import { EyeOutlined, CheckOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAction } from '../../context/actionContext';
import { useSettings } from '../../context/settingContext';

export default function RSSHeader({
          isDarkMode, action, author, onShowTitlesOnly, onShowMagazine, 
          onShowCards, onMenuItemClick, isSpinning, setIsSpinning }) {

    const headerStyle = {
        display: 'flex',
        position: 'sticky',
        top: 0,
        height:'3rem',
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDarkMode ? '#141414' : 'white',
        color: isDarkMode ? 'white' : 'black',
        padding: '10px 25px',
        borderBottom: isDarkMode ? '1px solid #262626' : '1px solid #dee2e6',
      };

      let headerTitle = '';
      switch (action) {
        case 'all':
          headerTitle = "All Feeds";
          break;
        case 'unread':
          headerTitle = "Unread Feeds";
          break;
        case 'star':
          headerTitle = "Starred Feeds";
          break;
        case 'account':
          headerTitle = "Account";
          break;
        case 'settings':
          headerTitle = "Settings";
          break;
        case 'explore':
          headerTitle = "Explore";
          break;
        case 'help':
          headerTitle = "Help";
          break;
        case 'subscriptions':
          headerTitle = author
          break;

        default:
          break;
          
      }

    const {updateHeaderAction } = useAction();
    const { settings } = useSettings();


      const handleReadClick = () => {
        updateHeaderAction('read');
      };

      const handleUpdateClick = () => {
        setIsSpinning(true);
        updateHeaderAction('update');
      };

      const renderIcons = () => {
        switch(action) {
            case 'all':
            case 'star':
            case 'unread':
            case 'subscriptions':
                return (
                    <div>
                        <Dropdown overlay={filtermenu}>
                            <Button icon={<EyeOutlined  />} style={{ marginRight: 8 }} />
                        </Dropdown>
                        <Dropdown overlay={eyeMenu}>
                            <Button icon={<ClockCircleOutlined />} style={{ marginRight: 8 }} />
                        </Dropdown>
                        <Button icon={<CheckOutlined  />} style={{ marginRight: 8 }} onClick={handleReadClick}/>
                        <Button icon={<SyncOutlined spin={isSpinning ? true : false} />} onClick={handleUpdateClick}/>

                    </div>
                );
            case 'account':
            case 'explore':
            case 'settings':
                return null; // 不显示icon
            default:
                return null;
        }
    };


    const handleLayoutTitleOnly = () => {
        onShowTitlesOnly();
      };
    
      const handleLayoutMagazine = () => {
        onShowMagazine();
      };
    
      const handleLayoutCards = () => {
        onShowCards();
      };

      const handleFilterClick = (e) => {
        updateHeaderAction('date');
        if (onMenuItemClick) {
          onMenuItemClick(e.key);
        }
    };
    
    const eyeMenu = (
        <Menu selectable={true} defaultSelectedKeys={"1"}>
            <Menu.Item key="1" onClick={handleFilterClick}>All time</Menu.Item>
            <Menu.Item key="2" onClick={handleFilterClick}>Within a day</Menu.Item>
            <Menu.Item key="3" onClick={handleFilterClick}>Within a week</Menu.Item>
            <Menu.Item key="4" onClick={handleFilterClick}>Within a month</Menu.Item>
        </Menu>
    );

    const filtermenu =(
      <Menu selectable={true} defaultSelectedKeys={[`${settings.default_presentation}`]}>
        <Menu.Item key="1" onClick={handleLayoutCards}>Cards View</Menu.Item>
        <Menu.Item key="2" onClick={handleLayoutMagazine}>Magazine View</Menu.Item>
        <Menu.Item key="3" onClick={handleLayoutTitleOnly}>Titles-only View</Menu.Item>
      </Menu>
    );

    return (
        (headerTitle || renderIcons()) ? (
            <div style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginLeft: 8, fontWeight:'bold', fontSize:"20px"}}>{headerTitle}</span>
                </div>
                {renderIcons()}
            </div>
        ) : null
    );
    
}
