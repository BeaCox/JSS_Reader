import React, {useState} from 'react';
import { Layout } from 'antd';

import { ReactComponent as CollapseLeftIcon } from '../assets/icons/navCollapseLeft.svg';
import { ReactComponent as CollapseRightIcon } from '../assets/icons/navCollapseRight.svg';

import FeedFilter from '../components/Sidebar/FeedFilter';
import FeedMenu from '../components/Sidebar/FeedMenu';

const { Sider } = Layout;

export default function Sidebar({folders, setFolders, onSelectedSubscription}){
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSubscriptionSelected = (fid, name) => {
    if (onSelectedSubscription) {
      onSelectedSubscription(fid, name); 
    }
  };

  return (
    <Sider collapsed={collapsed} theme='light' style={{maxHeight:'calc(100vh - 64px)',position:'sticky'}}>

      <FeedFilter collapsed={collapsed} />
        
      {collapsed ? '':<FeedMenu folders={folders} setFolders={setFolders} onSubscriptionSelected={handleSubscriptionSelected}/> }

      <div className='collapsebutton' style={collapsed ? {right:'2rem'} : {right:'1rem'} } onClick={toggleSidebar}>
          {collapsed ? <CollapseRightIcon className= 'sidebar-icon'/> : <CollapseLeftIcon className= 'sidebar-icon'/>}
      </div>

    </Sider>
);

};