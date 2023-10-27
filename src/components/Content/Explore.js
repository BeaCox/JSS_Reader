import React from 'react';
import { Tabs, Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const feedData = {
  '🎓 SJTU': [
    {
      img: 'https://bu.dusays.com/2023/07/29/64c4ffaa041d6.png',
      title: '电子信息与电气工程学院学术动态',
      description: 'This is a sample feed from SJTU.',
    },
    // ...  more SJTU feeds 
  ],
  '💻 Tech': [
    {
      img: 'url-to-image',
      title: 'Tech Feed Title 1',
      description: 'This is a sample tech feed.',
    },
  ],
  '🔬 Academics': [],
  '📰 News': [],
  '✏ Blog': [],
  '🎨 ACG': [],
  '🎮 Gaming': [],
};


export default function Explore() {
  return (
    <div style={{ padding: '2rem 2rem 2rem 1rem' }}>
      <Tabs defaultActiveKey="SJTU" tabPosition="left" size="large">
        {Object.entries(feedData).map(([key, feeds]) => (
          <TabPane tab={key} key={key}>
            {feeds.map(feed => (
              <Card
                key={feed.title}
                style={{ marginBottom: '20px' }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  {/* RSS Cover */}
                  <img alt={feed.title} src={feed.img} style={{ width: '120px', height: '120px', marginRight: '20px', borderRadius: '10px' }} />

                  {/* Title, Description and Icon/Button */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ margin: '0' }}>{feed.title}</h2>
                      <Button icon={<PlusOutlined />} style={{marginRight:'0.2rem'}}>
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
    </div>
  );
}