import React, { useState } from 'react';
import { Card, Row, Col, Skeleton, Typography } from 'antd';
import { LinkOutlined, StarOutlined, StarFilled, CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import RSSDetail from './RSSDetail';
import ArticleAPI from '../../api/ArticleAPI';
import { useSettings } from '../../context/settingContext';

function getFirstImage(description, content) {
  let match = description.match(/<img[\s\S]*?src=['"]?([^'">]+)['"]?/);

  if (!match && content) {
    match = content.match(/<img[\s\S]*?src=['"]?([^'">]+)['"]?/);
  }

  return match ? match[1] : null;
}

function extractTextFromHTML(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}

export default function CardView({ articles: initialArticles }) {
  const [currentArticle, setCurrentArticle] = useState(null);
  const [articles, setArticles] = useState(initialArticles); 
  const {settings} = useSettings();

const handleStar = async (index) => {
  const article = articles[index];
  try {
    // 更新文章的 starred 状态
    const updatedArticle = { ...article, starred: !article.starred };
    // 根据文章的新状态调用API
    if (updatedArticle.starred) {
      await ArticleAPI.starItem(article.iid);
    } else {
      await ArticleAPI.unstarItem(article.iid);
    }

    // 更新本地状态
    const updatedArticles = [...articles];
    updatedArticles[index] = updatedArticle;
    setArticles(updatedArticles);
  } catch (error) {
    console.error('Error toggling star:', error);
  }
}

const handleRead = async (index) => {
  const article = articles[index];
  try {
    // 更新文章的 starred 状态
    const updatedArticle = { ...article, unread: !article.unread };
    // 根据文章的新状态调用API
    if (updatedArticle.unread) {
      await ArticleAPI.markItemAsUnread(article.iid);
    } else {
      await ArticleAPI.markItemAsRead(article.iid);
    }

    // 更新本地状态
    const updatedArticles = [...articles];
    updatedArticles[index] = updatedArticle;
    setArticles(updatedArticles);
  } catch (error) {
    console.error('Error toggling read:', error);
  }
}

  return (
    <>
      <Row gutter={[20, 16]} style={{ padding: '2rem 3rem', margin: '0' }}>
        {articles.map((article, index) => {
          const imageUrl = getFirstImage(article.description, article.content);
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={article.fid}>
              <Card
                hoverable
                onClick={() => { 
                  setCurrentArticle(article);
                  if (settings.mark_as_read_on_scroll === 1) {
                    article.unread && handleRead(index); 
                  }
                }}
                style={{ 
                  width: '285px',
                  height: '360px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between' 
                }}
                bodyStyle={{padding:'20px'}}
                cover={ imageUrl && (
                  <img src={imageUrl} alt="Article Cover" style={{height:'180px', width:'285px', objectFit:'cover'}}/>
                )}
                actions={[
                  <div onClick={(e) => { e.stopPropagation(); handleStar(index); }}>
                    {article.starred ? <StarFilled style={{ fontSize: '24px' }} /> : <StarOutlined style={{ fontSize: '24px' }} />}
                  </div>,
                  <div onClick={(e) => { e.stopPropagation(); handleRead(index); }}>
                    {!article.unread ? <CheckCircleFilled style={{ fontSize: '24px' }} /> : <CheckCircleOutlined style={{ fontSize: '24px' }} />}
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
                          ellipsis={{ rows: imageUrl ? 1 : 8, expandable: false }}>
                            {extractTextFromHTML(article.description)}
                        </Typography.Paragraph>
                        <Typography.Text ellipsis={{ rows: 1, expandable: false }}>
                        {article.author} | {new Date(article.published).toLocaleString()}
                        </Typography.Text>
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
