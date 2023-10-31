import React, { useState } from 'react';
import { List, Typography, Button } from 'antd';
import { StarFilled, StarOutlined, CheckCircleOutlined, CheckCircleFilled, LinkOutlined } from '@ant-design/icons';
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

export default function MgzView({ articles: initialArticles, isDarkMode }) {
    const boxShadowColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const [currentArticle, setCurrentArticle] = useState(null);
    const [articles, setArticles] = useState(initialArticles);
    const { settings } = useSettings();

    const handleStar = async (index) => {
      const article = articles[index];
      try {
        const updatedArticle = { ...article, starred: !article.starred };
        if (updatedArticle.starred) {
          await ArticleAPI.starItem(article.iid);
        } else {
          await ArticleAPI.unstarItem(article.iid);
        }
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
        const updatedArticle = { ...article, unread: !article.unread };
        if (updatedArticle.unread) {
          await ArticleAPI.markItemAsUnread(article.iid);
        } else {
          await ArticleAPI.markItemAsRead(article.iid);
        }
        const updatedArticles = [...articles];
        updatedArticles[index] = updatedArticle;
        setArticles(updatedArticles);
      } catch (error) {
        console.error('Error toggling read:', error);
      }
    }
  
    return (
      <>
        <List
          itemLayout="vertical"
          dataSource={articles}
          renderItem={(article, index) => {
            const imageUrl = getFirstImage(article.description, article.content);
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
                onClick={() => { 
                  setCurrentArticle(article);
                  if (settings.mark_as_read_on_scroll === 1) {
                    article.unread && handleRead(index); 
                  }
                }}
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
                    {extractTextFromHTML(article.description)}
                  </Typography.Paragraph>
  
                  {/* Date & Icons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography.Text style={{maxWidth:'40rem'}} ellipsis>
                      {article.author} | {new Date(article.published).toLocaleString()}
                    </Typography.Text>
  
                    <div>
                    <Button 
                        icon={article.starred ? <StarFilled /> : <StarOutlined />} 
                        onClick={(e) => { e.stopPropagation(); handleStar(index); }}
                        style={{ border: 'none', background: 'none' }} />
                      <Button 
                        icon={article.unread ? <CheckCircleOutlined /> : <CheckCircleFilled />} 
                        onClick={(e) => { e.stopPropagation(); handleRead(index); }}
                        style={{border: 'none', background: 'none'}} />
                      <Button 
                        icon={<LinkOutlined />} 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
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
