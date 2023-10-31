import React, { useState, useRef, useEffect} from 'react';
import { Modal, Input, Select, Divider, Button, Space, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import * as FeedAPI from '../../api/FeedAPI'; 
import * as CategoryAPI from '../../api/CategoryAPI'; 
import { useFolder } from '../../context/folderContext';  
import { useAction } from '../../context/actionContext';

export default function NewFeed({ modalVisible, setModalVisible, initialFeed }) {
  const {folders, updateFolders } = useFolder();
  const { updateHeaderAction } = useAction();
  const [feedName, setFeedName] = useState(initialFeed?.name || '');
  const [rssUrl, setRssUrl] = useState(initialFeed?.url || '');
  const [folderName, setFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  
  useEffect(() => {
    setFeedName(initialFeed?.name || '');
    setRssUrl(initialFeed?.url || '');
}, [initialFeed]);


  //订阅是否有效
  const isValidURL = (str) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!isValidURL(rssUrl)) {
        message.error('Error: Invalid URL.');
        setIsLoading(false);
        return;
    }

    try {
        const response = await FeedAPI.addFeedToCategory(folderName, feedName, rssUrl);

        if (!response || response.status !== 200) {
            throw new Error('Invalid RSS URL or the server failed to respond.');
        }

        const feedData = response.data;
        if (!feedData) {
            throw new Error('Failed to add the feed.');
        }
      
        // 订阅是否已存在
        const isSubscriptionExists = folders.some(folder => 
            folder.subscriptions.some(sub => sub.url === rssUrl)
        );

        if (isSubscriptionExists) {
            message.error('Error: This subscription has already been added.');
            setIsLoading(false);
            return;
        }
        
        updateHeaderAction('update');
     
        updateFolders(prevFolders => {
            const newFolders = [...prevFolders];
            const folderIndex = newFolders.findIndex(folder => folder.name === folderName);
            
            if (folderIndex !== -1) {
                newFolders[folderIndex].subscriptions.push(feedData);
            }
            return newFolders;
        });
      
        setIsLoading(false);
        setModalVisible(false);
    } catch (err) {
        console.error(err);
        message.error('Error: Failed to add the feed. Please check the URL and try again.');
        setIsLoading(false);
        return;
    }
  };

  const addFolder = async (e) => {
    if (!folderName) {
        message.error('Error: No folder name entered.');
        return;
    }

    const folderExists = folders.some(folder => folder.name === folderName);
    if (folderExists) {
        message.error('Error: Folder already exists.');
        return;
    }

    try {
        // 调用后端API来添加新的分类
        const response = await CategoryAPI.addCategory(folderName);
        
        if (response.status !== 200 || !response.data.cid) {
            throw new Error('Failed to add the category in backend.');
        }

        updateFolders(prevFolders => [...prevFolders, { name: folderName, subscriptions: [] }]);
        setFolderName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    } catch (err) {
        console.error(err);
        message.error('Error: Failed to add the folder. Please try again.');
        return;
    }
};


  const onNameChange = (event) => {
      setFolderName(event.target.value);
  };

  return (
    <Modal title="Subscribe" open={modalVisible} footer={null} width={450} onCancel={() => setModalVisible(false)}>
        {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Spin />
              </div>
          ) : (
                <>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p>Name</p>
                    <Input placeholder="Subscription Name" value={feedName} 
                    onChange={(event) => setFeedName(event.target.value)}/>

                    <p>URL</p>
                    <Input placeholder="https://example.com/feed" value={rssUrl} 
                    onChange={(event) => setRssUrl(event.target.value)}/>

                    <p>Folder</p>
                      <Select 
                          placeholder="choose a folder"
                          dropdownRender={(menu) => (
                              <>
                                  {folders.length ? menu : <div style={{ padding: '4px 8px' }}>Please add a folder first</div>}
                                  <Divider style={{ margin: '8px 0' }} />
                                  <Space style={{padding: '0 8px 4px' }}>
                                      <Input placeholder="New folder name" ref={inputRef} value={folderName} onChange={onNameChange} />
                                      <Button type="text" icon={<PlusOutlined />} onClick={addFolder}> Add folder </Button>
                                  </Space>
                              </>
                          )}
                          options={folders.map((folder) => ({ label: folder.name, value: folder.name }))}
                          onChange={value => setFolderName(value)}
                      />
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <Button type="primary" onClick={handleSubmit} disabled={!folderName || !rssUrl || !feedName}>Add Feed</Button>
                  </div>
              </>
          )}
      </Modal>
  );
}