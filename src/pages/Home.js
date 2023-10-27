import React, {useState}from 'react';
import { Layout , ConfigProvider, theme} from 'antd';
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import Content from '../layout/Content';
import { ContentProvider } from '../services/Context';



const Home = () => {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [folders, setFolders] = useState([]);
  const toggleTheme = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };

  // 在useState中添加selectedSubscription状态
const [selectedSubscription, setSelectedSubscription] = useState(null);
const selectedSubscriptionName = selectedSubscription ? selectedSubscription.name : '';
const selectedSubscriptionFid = selectedSubscription ? selectedSubscription.fid : '';

const handleSubscriptionSelected = (fid, name) => {
  setSelectedSubscription({ fid, name });
};

  return (
    <ContentProvider>
      <ConfigProvider theme={{algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,}}>
        <Layout style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* header on the top */}
          <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    
          {/* layout on the bottom */}
          <Layout style={{ display: 'flex', flexDirection: 'row'}}>
            {/* feed list */}
            <Sidebar folders={folders} setFolders={setFolders}  onSelectedSubscription={handleSubscriptionSelected}/>

            {/* feed content */}
            <Content author={selectedSubscriptionName} fid={selectedSubscriptionFid} isDarkMode={isDarkMode} />
          </Layout>
    
        </Layout>
      </ConfigProvider>
    </ContentProvider>
  );
  
};

export default Home;

  