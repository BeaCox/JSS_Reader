import React, { useState } from 'react';
import { List, Typography, Button } from 'antd';
import { StarFilled, StarOutlined, CheckCircleOutlined, CheckCircleFilled, LinkOutlined } from '@ant-design/icons';
import RSSDetail from './RSSDetail'; 

function getFirstImage(content) {
  const match = content.match(/<img[^>]+src=['"]([^'">]+)['"]/); 
  return match ? match[1] : null;
}

  export default function MgzView({ articles, isDarkMode }) {
    const boxShadowColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const [currentArticle, setCurrentArticle] = useState(null);
  
    return (
      <>
        <List
          itemLayout="vertical"
          dataSource={articles}
          renderItem={article => {
            const imageUrl = getFirstImage(article.content);
            return (
              <List.Item
                key={article.fid}
                style={{
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  padding: '1rem 15rem',
                  height: '10rem',
                  display: 'flex',
                  flexDirection: 'row',
                }}
                onClick={() => setCurrentArticle(article)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 15px ${boxShadowColor}`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
              >
                {/* Image */}
                {imageUrl && (
                  <img src={imageUrl} alt="Article" style={{ width: '180px', height: '125px', objectFit: 'cover', marginRight: '1rem' }} />
                )}
  
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {/* Title */}
                  <Typography.Text strong style={{fontSize:'16px'}} >
                    {article.title}
                  </Typography.Text>
                  
                  {/* Description */}
                  <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: '-1rem'}}>
                    {article.description}
                  </Typography.Paragraph>
  
                  {/* Date & Icons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography.Text>
                      {article.author} | {new Date(article.published).toLocaleString()}
                    </Typography.Text>
  
                    <div>
                      <Button 
                        icon={article.starred ? <StarFilled /> : <StarOutlined />} 
                        onClick={(e) =>{ e.stopPropagation();}}
                        style={{ border: 'none', background: 'none' }} />
                      <Button 
                        icon={article.unread ? <CheckCircleOutlined /> : <CheckCircleFilled />} 
                        onClick={(e) =>{ e.stopPropagation();}}
                        style={{border: 'none', background: 'none'}} />
                      <Button 
                        icon={<LinkOutlined />} 
                        href={article.url} 
                        onClick={(e) =>{ e.stopPropagation();}}
                        style={{border: 'none', background: 'none'}}/>
                    </div>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
        <RSSDetail
          articles={articles}
          currentArticle={currentArticle}
          closeDetail={() => setCurrentArticle(null)}
        />
      </>
    );
}
