import React, { useState, useEffect } from 'react';
import { Tabs, Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import NewFeed from '../Sidebar/NewFeed';

const { TabPane } = Tabs;

const categoryMapping = {
  'SJTU': '🎓 SJTU',
  'Journal': '🔬 Academics',
  'Gaming': '🎮 Gaming',
  'Information': '📰 News',
  'Entertainment': '🎦 Entertainment',
};

const fetchFeedsByCategory = async (categoryKey) => {
  try {
    const feeds = await axios.get(`/api/v1/explore/${categoryKey}`);
    return feeds.data.map(feed => ({
      img: feed.image,
      title: feed.name,
      description: feed.description ,
      eid: feed.eid,
      url: feed.url
    }));
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return [];
  }
};

export default function Explore() {
  const [feedData, setFeedData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState({ name: '', url: '' });


  useEffect(() => {
    const fetchAllFeeds = async () => {
      const newFeedData = {};

      for (let categoryKey in categoryMapping) {
        newFeedData[categoryMapping[categoryKey]] = await fetchFeedsByCategory(categoryKey);
      }

      setFeedData(newFeedData);
    };

    fetchAllFeeds();
  }, []);

  NewFeed.defaultProps = {
    initialFeed: { name: '', url: '' },
  };
  
  return (
    <div style={{ padding: '2rem 2rem 2rem 1rem' }}>
      <Tabs defaultActiveKey="🎓 SJTU" tabPosition="left" size="large">
        {Object.entries(feedData).map(([key, feeds]) => (
          <TabPane tab={key} key={key}>
            {feeds.map(feed => (
              <Card
                key={feed.title}
                style={{ marginBottom: '20px' }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <img alt={feed.title} src={feed.img} style={{ width: '120px', height: '120px', marginRight: '20px', borderRadius: '10px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ margin: '0' }}>{feed.title}</h2>
                      <Button
                          icon={<PlusOutlined />}
                          style={{ marginRight: '0.2rem' }}
                          onClick={() => {
                            setSelectedFeed({ name: feed.title, url: feed.url }); 
                            setIsModalVisible(true);
                          }}
                        >
                          Subscribe
                        </Button>
                    </div>
                    <p style={{ margin: '0' }}>{feed.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabPane>
        ))}
      </Tabs>
      <NewFeed modalVisible={isModalVisible} setModalVisible={setIsModalVisible} initialFeed={selectedFeed} />
    </div>
  );
}
