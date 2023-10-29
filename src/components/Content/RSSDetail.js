import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { LeftOutlined, RightOutlined, StarOutlined, CheckCircleOutlined, LinkOutlined, 
  UpOutlined, DownOutlined, StarFilled, CheckCircleFilled } from '@ant-design/icons';
import './article.css'
import ArticleAPI from '../../api/ArticleAPI';
import { useSettings } from '../../context/settingContext';

const fontSizeMapping = {
  1: '12px',
  2: '16px',
  3: '20px',
};

const fontFamilyMapping = {
  1: 'Arial, sans-serif',
  2: 'Courier New, monospace',
  3: 'Times New Roman, serif',
};

const displayDensityMapping = {
  1: '1.2',
  2: '1.5',
  3: '1.8',
};

function ArticleContent({ content, description}) {
  // 使用映射对象更新组件中的动态样式
const { settings } = useSettings();

const dynamicStyle = {
  fontSize: fontSizeMapping[settings.font_size],
  fontFamily: fontFamilyMapping[settings.font_family],
  lineHeight: displayDensityMapping[settings.display_density],
};
  const safeContent = content ? content : description;
  return <div className="article-content" style={dynamicStyle} dangerouslySetInnerHTML={{ __html: safeContent }} />;
}

export default function RSSDetail({ articles, currentArticle, closeDetail, setArticles}) {
  const [isModalVisible, setIsModalVisible] = useState(!!currentArticle);
  const [currentDetailArticle, setCurrentDetailArticle] = useState(currentArticle);

  useEffect(() => {
    setIsModalVisible(!!currentArticle);
    setCurrentDetailArticle(currentArticle);
  }, [currentArticle]);

  const nextArticle = () => {
    const currentIndex = articles.findIndex(article => article.iid === currentDetailArticle.iid);
    if (currentIndex < articles.length - 1) {
      setCurrentDetailArticle(articles[currentIndex + 1]);
    }
  };
  
  const prevArticle = () => {
    const currentIndex = articles.findIndex(article => article.iid === currentDetailArticle.iid);
    if (currentIndex > 0) {
      setCurrentDetailArticle(articles[currentIndex - 1]);
    }
  };

  const handleStar = async () => {
    try {
      const updatedArticle = { ...currentDetailArticle, starred: !currentDetailArticle.starred };
      if (updatedArticle.starred) {
        await ArticleAPI.starItem(updatedArticle.iid);
      } else {
        await ArticleAPI.unstarItem(updatedArticle.iid);
      }

      // Update local state
      setCurrentDetailArticle(updatedArticle);

      // Update global articles state
      const articleIndex = articles.findIndex(article => article.iid === updatedArticle.iid);
      const updatedArticles = [...articles];
      updatedArticles[articleIndex] = updatedArticle;
      setArticles(updatedArticles);
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  }

  const handleRead = async () => {
    try {
      const updatedArticle = { ...currentDetailArticle, unread: !currentDetailArticle.unread };
      if (updatedArticle.unread) {
        await ArticleAPI.markItemAsUnread(updatedArticle.iid);
      } else {
        await ArticleAPI.markItemAsRead(updatedArticle.iid);
      }

      // Update local state
      setCurrentDetailArticle(updatedArticle);

      // Update global articles state
      const articleIndex = articles.findIndex(article => article.iid === updatedArticle.iid);
      const updatedArticles = [...articles];
      updatedArticles[articleIndex] = updatedArticle;
      setArticles(updatedArticles);
    } catch (error) {
      console.error('Error toggling read:', error);
    }
  }
  const scrollup = () => {
    const contentContainer = document.querySelector('.modal-content-container');
    if(contentContainer) {
      contentContainer.scrollTop -= 500;
    }
  }

  const scrolldown = () => {
    const contentContainer = document.querySelector('.modal-content-container');
    if(contentContainer) {
      contentContainer.scrollTop += 500;
    }
  }

  const openLinkInNewTab = () => {
    window.open(currentDetailArticle.url, '_blank');
  };
  
  return (
    <div>
      {currentDetailArticle && (
        <Modal
          open={isModalVisible}
          footer={null}
          width={950}
          centered={true}
          style={{ position: 'relative', overflowY: 'visible'}}
          styles={{ body: {height: 820, padding:'5px 5rem'} }}
          onCancel={() => {
            setIsModalVisible(false);
            closeDetail();
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div onClick={(e) => { e.stopPropagation(); handleStar(); }} style={{cursor:'pointer'}}>
                {currentDetailArticle && currentDetailArticle.starred 
                    ? <StarFilled style={{ margin: '0 10px', fontSize: '20px' }} />
                    : <StarOutlined style={{ margin: '0 10px', fontSize: '20px' }} />
                }
            </div>
            <div onClick={(e) => { e.stopPropagation(); handleRead(); }} style={{cursor:'pointer'}}>
                {currentDetailArticle && !currentDetailArticle.unread 
                    ? <CheckCircleFilled style={{ margin: '0 10px', fontSize: '20px' }} />
                    : <CheckCircleOutlined style={{ margin: '0 10px', fontSize: '20px' }} />
                }
            </div>
            <LinkOutlined style={{ margin: '0 10px', fontSize:'20px' }} onClick={(e) => { e.stopPropagation(); openLinkInNewTab(); }}/>
            <UpOutlined style={{ margin: '0 10px', fontSize:'20px' }} onClick={(e) => { e.stopPropagation(); scrollup(); }}/>
            <DownOutlined style={{ margin: '0 10px', fontSize:'20px' }} onClick={(e) => { e.stopPropagation(); scrolldown(); }}/>
          </div>
          <div className="modal-content-container">
            <hr />
            <h2>{currentDetailArticle.title}</h2>
            <p>
              {currentDetailArticle.author} | {new Date(currentDetailArticle.published).toLocaleString()}
            </p>
            {currentDetailArticle && <ArticleContent content={currentDetailArticle.content} description={currentDetailArticle.description} />}
            <LeftOutlined
              onClick={prevArticle}
              style={{ position: 'absolute', left: -60, top: '50%', transform: 'translateY(-50%)', fontSize: 50, cursor: 'pointer' }}
            />
            <RightOutlined
              onClick={nextArticle}
              style={{ position: 'absolute', right: -60, top: '50%', transform: 'translateY(-50%)', fontSize: 50, cursor: 'pointer' }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
