import React from 'react';
import {Menu} from 'antd';
import { useAction } from '../../context/actionContext'; 
import '../../layout/Sidebar.css'

import { ReactComponent as AllIcon } from '../../assets/icons/All.svg';
import { ReactComponent as UnreadIcon } from '../../assets/icons/Unread.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/Star.svg';
import { ReactComponent as ExploreIcon } from '../../assets/icons/Explore.svg';


function getItem(label, key, icon, children, type, onClick) {
    return {
      key,
      icon,
      children,
      label,
      type,
      onClick
    };
  }

export default function FeedFilter({collapsed}){
    const onClick = (e) => {
        console.log('click ', e);
      }; 
    
    const { updateAction } = useAction();

    const handleAllClick = () => {
      updateAction('all');

    };

    const handleUnreadClick = () => {
      
      updateAction('unread');
    };

    const handleStarClick = () => {
      updateAction('star');
    };

    const handleExploreClick = () => {
  
      updateAction('explore');
    };
    
    
    const items = [
        getItem('All', '1', <AllIcon className='sidebar-icon'/>, '', 'menu', handleAllClick),
        getItem('Unread', '2', <UnreadIcon className='sidebar-icon'/>, '', 'menu', handleUnreadClick),
        getItem('Star', '3', <StarIcon className='sidebar-icon'/>, '', 'menu', handleStarClick),
        getItem('Explore', '4', <ExploreIcon className='sidebar-icon'/>, '', 'menu', handleExploreClick),
        collapsed ? null : getItem('', '', '', '', 'divider')
      ].filter(Boolean);

    return (
        <Menu
            onClick={onClick}
            mode="inline"
            selectable={false}
            inlineCollapsed={collapsed}
        >
            {items.map(item => (
              item.type === 'divider' ? 
              (<Menu.Divider />) :
              (<Menu.Item key={item.key} icon={item.icon} className='menustyle' onClick={item.onClick}>
              {item.label}
              </Menu.Item>)
          ))}
        </Menu>
      )
    
  }
  