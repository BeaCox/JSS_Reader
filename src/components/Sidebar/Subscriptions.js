import React, { useState,useEffect } from 'react';
import { Menu, message, Modal,Button, } from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import { ReactComponent as FolderIcon } from '../../assets/icons/Folder.svg';
import * as CategoryAPI from '../../services/CategoryAPI'; 
import * as FeedAPI from '../../services/FeedAPI';
import { useContent } from '../../services/Context';  

export default function Subscription({ onSubscriptionClick }) {
    const { folders, updateFolders } = useContent();
    const [targetKey, setTargetKey] = useState(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    const { updateAction } = useContent();

    const showDeleteConfirmModal = () => {
        setConfirmModalVisible(true);
    };

    const handleConfirmDelete = () => {
        handleDelete();
        setConfirmModalVisible(false);
        setContextMenuVisible(false);
    };

    const handleCancelDelete = () => {
        setConfirmModalVisible(false);
    };

    const handleRightClick = (e, key) => {
        e.preventDefault();
        e.stopPropagation();
        setTargetKey(key);
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setContextMenuVisible(true);
    };

    const handleFeedClick = (feed) => {
        if (onSubscriptionClick) {
            onSubscriptionClick(feed.fid, feed.name); 
        }
        updateAction('subscriptions');
    };
    
    const handleDelete = () => {
        const [type, index, subIndex] = targetKey.split('-');
        const idx = parseInt(index, 10);
        const subIdx = parseInt(subIndex, 10);
        
        if (type === "folder") {
            CategoryAPI.deleteCategory(folders[idx].name)  
            .then(() => {
                updateFolders(prevFolders => {
                    const newFolders = [...prevFolders];
                    newFolders.splice(idx, 1); 
                    return newFolders;
                });
                message.success('Folder deleted successfully.');
            })
            .catch(error => {
                message.error('Error deleting folder: ' + error.message);
            });
        } else if (type === "subscription") {
            FeedAPI.deleteFeed(folders[idx].name, folders[idx].subscriptions[subIdx].fid)
            .then(() => {
                updateFolders(prevFolders => {
                    const newFolders = [...prevFolders];
                    newFolders[idx].subscriptions.splice(subIdx, 1);
                    return newFolders;
                });
                message.success('Subscription deleted successfully.');
            })
            .catch(error => {
                message.error('Error deleting subscription: ' + error.message);
            });
        }
    
        setTargetKey(null);
    };

    useEffect(() => {
        const closeMenuOnOutsideClick = (e) => {
            if (contextMenuVisible) {
                setContextMenuVisible(false);
            }
        };
        document.addEventListener('click', closeMenuOnOutsideClick);

        return () => {
            document.removeEventListener('click', closeMenuOnOutsideClick);
        };
    }, [contextMenuVisible]);

    return (
        <div style={{ height: '540px', overflowY: 'auto', marginTop: '4px' }}>
            <Menu selectable={false} mode="inline" multiple={false} style={{ borderRight: 'none' }}>
                {folders.map((folder, index) => (
                    <Menu.SubMenu
                        key={index}
                        title={folder.name}
                        icon={<FolderIcon style={{ width: '15px', height: '15px', marginLeft: '-10px' }} />}
                        onContextMenu={(e) => handleRightClick(e, `folder-${index}`)}
                    >
                        {folder.subscriptions.map((subscription, subIndex) => (
                            <Menu.Item
                                key={`${index}-${subIndex}`}
                                style={{ height: '30px', fontSize: '14px', textAlign: 'left' }}
                                onClick={() => handleFeedClick(subscription)}
                                onContextMenu={(e) => handleRightClick(e, `subscription-${index}-${subIndex}`)}
                            >
                                {subscription.name}
                            </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                ))}
            </Menu>

            {contextMenuVisible && (
                <div
                    style={{
                        position: 'fixed',
                        top: menuPosition.y,
                        left: menuPosition.x,
                        zIndex: 1000,
                        borderRadius: '7px'
                    }}
                    onMouseLeave={() => setContextMenuVisible(false)}  
                >
        
                <Button  
                    onClick={showDeleteConfirmModal}
                    icon={<DeleteOutlined style={{color: 'red'}} />}
                    style={{color: 'red', borderColor: 'red', margin:'0'}}
                >
                    Delete
                </Button>
                </div>
            )}

            <Modal
                title="Confirm deletion"
                open={confirmModalVisible}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                centered
                footer={[
                    <Button key="cancel" onClick={handleCancelDelete}>
                    Cancel
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={handleConfirmDelete}>
                    Yes
                    </Button>,
                ]}
            >
                Are you sure you want to delete it?
            </Modal>
        </div>
    );
}