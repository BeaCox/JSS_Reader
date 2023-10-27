import React, { useState } from 'react';
import { Card, Row, Col, Skeleton, Typography } from 'antd';
import { LinkOutlined, StarOutlined, StarFilled, CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import RSSDetail from './RSSDetail';

// Extract 1st img as the cover
function getFirstImage(content) {
  const match = content.match(/<img[^>]+src=['"]([^'">]+)['"]/); 
  return match ? match[1] : null;
}

export default function CardView({ articles }) {
  const [starred, setStarred] = useState(Array(articles.length).fill(false));
  const [read, setRead] = useState(Array(articles.length).fill(false));
  const [currentArticle, setCurrentArticle] = useState(null);

  const handleStar = (index) => {
    const newStarred = [...starred];
    newStarred[index] = !newStarred[index];
    setStarred(newStarred);
  }

  const handleRead = (index) => {
    const newRead = [...read];
    newRead[index] = !newRead[index];
    setRead(newRead);
  }

  return (
    <>
      <Row gutter={[16, 16]} style={{ padding: '2rem 3rem', margin: '0' }}>
        {articles.map((article, index) => {
          const imageUrl = getFirstImage(article.content);
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={article.fid}>
              <Card
                hoverable
                onClick={() => setCurrentArticle(article)}
                style={{ 
                  width: '325px',
                  height: '360px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between' 
                }}
                bodyStyle={{padding:'20px'}}
                cover={ imageUrl && (
                  <img src={imageUrl} alt="Article Cover" style={{height:'180px', width:'325px', objectFit:'cover'}}/>
                )}
                actions={[
                  <div onClick={(e) => { e.stopPropagation(); handleStar(index); }}>
                    {starred[index] ? <StarFilled style={{ fontSize: '24px' }} /> : <StarOutlined style={{ fontSize: '24px' }} />}
                  </div>,
                  <div onClick={(e) => { e.stopPropagation(); handleRead(index); }}>
                    {read[index] ? <CheckCircleFilled style={{ fontSize: '24px' }} /> : <CheckCircleOutlined style={{ fontSize: '24px' }} />}
                  </div>,
                  <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation() }}>
                    <LinkOutlined style={{ fontSize: '24px' }} />
                  </a>
                ]}
              >
                <Skeleton loading={!article}>
                  <Card.Meta      
                    title={
                      <Typography.Text 
                        style={{ fontWeight: 'bold',fontSize:'16px' }}>
                          {article.title}
                      </Typography.Text >
                    }
                    description={
                      <div>
                        <Typography.Paragraph 
                          ellipsis={{ rows: imageUrl ? 1 : 9, expandable: false }}>
                            {article.description}
                        </Typography.Paragraph>
                        {article.author} | {new Date(article.published).toLocaleString()}
                      </div>
                    }
                  />
                </Skeleton>
              </Card>
            </Col>
          )
        })}
      </Row>
      <RSSDetail
        articles={articles}
        currentArticle={currentArticle}
        closeDetail={() => setCurrentArticle(null)}
      />
    </>
  );
}
