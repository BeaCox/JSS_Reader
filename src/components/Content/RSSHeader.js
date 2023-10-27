import React from 'react';
import {Button, Menu, Dropdown} from 'antd';
import { EyeOutlined, StarOutlined, CheckOutlined, SyncOutlined} from '@ant-design/icons';

export default function RSSHeader({ isDarkMode, onShowTitlesOnly, onShowMagazine, onShowCards, author, action}) {
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
        case 'subscriptions':
          headerTitle = author
          break;

        default:
          break;
          
      }

      const renderIcons = () => {
        switch(action) {
            case 'all':
            case 'star':
            case 'unread':
            case 'subscriptions':
                return (
                    <div>
                        <Dropdown overlay={eyeMenu}>
                            <Button icon={<EyeOutlined />} style={{ marginRight: 8 }} />
                        </Dropdown>
                        <Button icon={<CheckOutlined  />} style={{ marginRight: 8 }} />
                        <Button icon={<StarOutlined />} style={{ marginRight: 8 }} />
                        <Button icon={<SyncOutlined />} />
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

    const eyeMenu = (
        <Menu>
            <Menu.ItemGroup title="Show First">
                <Menu.Item key="1" >Newest</Menu.Item>
                <Menu.Item key="2" >Oldest</Menu.Item>
            </Menu.ItemGroup>
            <Menu.Divider />
            <Menu.ItemGroup title="Layout">
                <Menu.Item key="3" onClick={handleLayoutTitleOnly}>Titles-only View</Menu.Item>
                <Menu.Item key="4" onClick={handleLayoutMagazine}>Magazine View</Menu.Item>
                <Menu.Item key="5" onClick={handleLayoutCards}>Cards View</Menu.Item>
            </Menu.ItemGroup>
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
