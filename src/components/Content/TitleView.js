import React, { useState } from 'react';
import { List, Button, Typography } from 'antd';
import { LinkOutlined, StarOutlined, StarFilled, CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import RSSDetail from './RSSDetail';
import ArticleAPI from '../../api/ArticleAPI';
import { useSettings } from '../../context/settingContext';

function extractTextFromHTML(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

export default function TitleView({ articles: initialArticles, isDarkMode }) {
    const boxShadowColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const [currentArticle, setCurrentArticle] = useState(null);
    const [articles, setArticles] = useState(initialArticles); 
    const {settings} = useSettings();

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
                itemLayout="horizontal"
                dataSource={articles}
                renderItem={(article, index) => (
                    <List.Item
                        key={article.fid}
                        style={{
                            transition: 'all 0.3s',
                            cursor: 'pointer',
                            height:'45px',
                        }}
                        actions={[
                            <Typography.Text ellipsis style={{ maxWidth: '7rem'}}>
                                {article.author}
                            </Typography.Text>,
                            <Typography.Text >
                                {new Date(article.published).toLocaleString()}
                            </Typography.Text>,
                            <Button 
                                icon={article.unread ? <CheckCircleOutlined /> : <CheckCircleFilled />} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRead(index);
                                }} 
                                style={{ border: 'none', background: 'none' }}
                            />,
                            <Button 
                                icon={<LinkOutlined />} 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => { e.stopPropagation(); }}
                                style={{border: 'none', background: 'none'}}
                            />
                        ]}
                        onClick={() => { 
                            setCurrentArticle(article);
                            if (settings.mark_as_read_on_scroll === 1) {
                                article.unread && handleRead(index); 
                            }
                            }}  
                        onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 15px ${boxShadowColor}`}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Button 
                                icon={article.starred ? <StarFilled /> : <StarOutlined />} 
                                onClick={(e) => { 
                                    e.stopPropagation();
                                    handleStar(index);
                                }} 
                                style={{ border: 'none', background: 'none',marginLeft:'1rem'}}
                            />
                            <Typography.Text strong 
                                style={{ maxWidth:'12rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {article.title}
                            </Typography.Text>
                            <Typography.Text ellipsis 
                                style={{ maxWidth: '48rem', whiteSpace: 'nowrap' }}>
                                {extractTextFromHTML(article.description)}
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
