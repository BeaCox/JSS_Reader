import React, { useState}from 'react';
import { Layout , ConfigProvider, theme} from 'antd';
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import Content from '../layout/Content';
import { FolderProvider } from '../context/folderContext';
import { useSettings } from '../context/settingContext';
import { ActionProvider } from '../context/actionContext';

const Home = () => {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const { isDarkMode } = useSettings();
  const [folders, setFolders] = useState([]);
  
const [selectedSubscription, setSelectedSubscription] = useState(null);
const selectedSubscriptionName = selectedSubscription ? selectedSubscription.name : '';
const selectedSubscriptionFid = selectedSubscription ? selectedSubscription.fid : '';

const handleSubscriptionSelected = (fid, name) => {
  setSelectedSubscription({ fid, name });
};

  return (
    <ActionProvider>
      <ConfigProvider theme={{algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,}}>
        <Layout style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* header on the top */}
          <Header isDarkMode={isDarkMode} />
    
          {/* layout on the bottom */}
          <Layout style={{ display: 'flex', flexDirection: 'row'}}>
            {/* feed list */}
            <FolderProvider>
              <Sidebar folders={folders} setFolders={setFolders}  onSelectedSubscription={handleSubscriptionSelected}/>
           
            {/* feed content */}
            <Content author={selectedSubscriptionName} fid={selectedSubscriptionFid} isDarkMode={isDarkMode} />
             </FolderProvider>
          </Layout>
    
        </Layout>
      </ConfigProvider>
    </ActionProvider>
  );
  
};

export default Home;

  