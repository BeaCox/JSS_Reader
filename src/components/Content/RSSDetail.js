import React, { useState, useEffect } from 'react';
import { Modal, FloatButton } from 'antd';
import DOMPurify from "dompurify";
import { LeftOutlined, RightOutlined, StarOutlined, CheckCircleOutlined, LinkOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import './article.css'

function ArticleContent({ content }) {
  const safeContent = DOMPurify.sanitize(content);
  return <div className="article-content" dangerouslySetInnerHTML={{ __html: safeContent }} />;
}


export default function RSSDetail({ articles, currentArticle, closeDetail }) {
  const [isModalVisible, setIsModalVisible] = useState(!!currentArticle);
  const [currentDetailArticle, setCurrentDetailArticle] = useState(currentArticle);

  useEffect(() => {
    setIsModalVisible(!!currentArticle);
    setCurrentDetailArticle(currentArticle);
  }, [currentArticle]);

  const nextArticle = () => {
    const currentIndex = articles.findIndex(article => article.fid === currentDetailArticle.fid);
    if (currentIndex < articles.length - 1) {
      setCurrentDetailArticle(articles[currentIndex + 1]);
    }
  };

  const prevArticle = () => {
    const currentIndex = articles.findIndex(article => article.fid === currentDetailArticle.fid);
    if (currentIndex > 0) {
      setCurrentDetailArticle(articles[currentIndex - 1]);
    }
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <div>
              <StarOutlined style={{ margin: '0 10px', fontSize:'20px'}} />
              <CheckCircleOutlined style={{ margin: '0 10px', fontSize:'20px'}} />
              <LinkOutlined style={{ margin: '0 10px', fontSize:'20px' }} />
              <UpOutlined style={{ margin: '0 10px', fontSize:'20px' }} />
              <DownOutlined style={{ margin: '0 10px', fontSize:'20px' }} />
            </div>
          </div>
          <div className="modal-content-container">
            <hr />
            <h2>{currentDetailArticle.title}</h2>
            <p>
              {currentDetailArticle.author} | {new Date(currentDetailArticle.published).toLocaleString()}
            </p>
            {currentDetailArticle && <ArticleContent content={currentDetailArticle.content} />}
            <LeftOutlined
              onClick={prevArticle}
              style={{ position: 'absolute', left: -60, top: '50%', transform: 'translateY(-50%)', fontSize: 50, cursor: 'pointer' }}
            />
            <RightOutlined
              onClick={nextArticle}
              style={{ position: 'absolute', right: -60, top: '50%', transform: 'translateY(-50%)', fontSize: 50, cursor: 'pointer' }}
            />
            <FloatButton.BackTop />
          </div>
        </Modal>
      )}
    </div>
  );
}
