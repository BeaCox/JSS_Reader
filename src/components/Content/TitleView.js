import React, { useState } from 'react';
import { List, Button, Typography } from 'antd';
import { LinkOutlined, StarOutlined, StarFilled, CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import RSSDetail from './RSSDetail';


export default function TitleView({ articles, isDarkMode }) {
    const boxShadowColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const [currentArticle, setCurrentArticle] = useState(null);

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={articles}
        renderItem={article => (
          <List.Item
            key={article.fid}
            style={{
              transition: 'all 0.3s',
              cursor: 'pointer',
              height:'40px',
            }}
            actions={[
              <Typography.Text>
                {article.author} | {new Date(article.published).toLocaleString()}
              </Typography.Text>,
              <Button 
                icon={article.unread ? <CheckCircleOutlined /> : <CheckCircleFilled />} 
                onClick={(e) => e.stopPropagation()} 
                style={{ border: 'none', background: 'none' }}
              />,
              <Button 
                    icon={<LinkOutlined />} 
                    href={article.url} 
                    onClick={(e) =>{ e.stopPropagation();}}
                    style={{border: 'none', background: 'none'}}/>
            ]}
            onClick={() => setCurrentArticle(article)}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 15px ${boxShadowColor}`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Button 
                icon={article.starred ? <StarFilled /> : <StarOutlined />} 
                onClick={(e) => { e.stopPropagation(); /* Handle Star functionality here */ }} 
                style={{ border: 'none', background: 'none',marginLeft:'1rem'}}
              />
              <Typography.Text strong 
                style={{ maxWidth:'12rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {article.title}
              </Typography.Text>
              <Typography.Text ellipsis 
                style={{ maxWidth: '50rem', whiteSpace: 'nowrap' }}>
                {article.description}
              </Typography.Text>
            </div>
          </List.Item>
        )}
      />
      <RSSDetail
        articles={articles}
        currentArticle={currentArticle}
        closeDetail={() => setCurrentArticle(null)}
      />
    </>
  );
}