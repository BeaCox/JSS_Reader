import React, { useState} from 'react';
import { Menu, Dropdown} from 'antd';
import { PlusOutlined} from '@ant-design/icons';
import { ReactComponent as MoreIcon } from '../../assets/icons/More.svg';
import NewFeed from './NewFeed';
import Subscription from './Subscriptions'

export default function FeedMenu({folders, setFolders, onSubscriptionSelected}) {
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleNewFeedClick = () => {
    setModalVisible(true);
  };

  const handleSubscriptionClick = (fid, name) => {
    if (onSubscriptionSelected) {
        onSubscriptionSelected(fid, name);
    }
};

  const FeedOpMenu = (
    <Menu>
      <Menu.Item key="1" icon={<PlusOutlined />} onClick={handleNewFeedClick}>
        New Feed
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 10px 0 10px'}}>
        <span style={{ color: 'gray', fontSize:'15px'}}>Feed</span>
        <Dropdown overlay={FeedOpMenu}>
          <MoreIcon style={{ cursor: 'pointer', width:'20px', height:'20px'}} />
        </Dropdown>
        <NewFeed modalVisible={modalVisible} setModalVisible={setModalVisible} folders={folders} setFolders={setFolders} />
      </div>
      <div>
        <Subscription folders={folders} onSubscriptionClick={handleSubscriptionClick}/>
      </div>
    </div>
  )
}

