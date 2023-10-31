import React, { createContext, useContext, useState, useEffect } from 'react';
import * as CategoryAPI from './CategoryAPI'; 
import * as FeedAPI from './FeedAPI';
import ArticleAPI from './ArticleAPI';

const ContentContext = createContext();

export const useContent = () => {
  return useContext(ContentContext);
};

export function ContentProvider({ children }) {
  const [action, setAction] = useState();
  const [articles, setArticles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [headerAction, setHeaderAction] = useState(null);
  const [settings, setSettings] = useState({});

  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
};

  const updateHeaderAction = (newAction) => {
    setHeaderAction(newAction);
  };
  
  const updateAction = async (newAction) => {
    setAction(newAction);

  };

  const starArticle = async (articleId) => {
    try {
      const articleIndex = articles.findIndex(a => a.iid === articleId);
      const updatedArticle = { ...articles[articleIndex], starred: !articles[articleIndex].starred };

      // 根据文章的新状态调用API
      if (updatedArticle.starred) {
        await ArticleAPI.starItem(articleId);
      } else {
        await ArticleAPI.unstarItem(articleId);
      }

      const updatedArticles = [...articles];
      updatedArticles[articleIndex] = updatedArticle;
      setArticles(updatedArticles);
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  }

  const markArticleAsRead = async (articleId) => {
    try {
      const articleIndex = articles.findIndex(a => a.iid === articleId);
      const updatedArticle = { ...articles[articleIndex], unread: !articles[articleIndex].unread };

      // 根据文章的新状态调用API
      if (updatedArticle.unread) {
        await ArticleAPI.markItemAsUnread(articleId);
      } else {
        await ArticleAPI.markItemAsRead(articleId);
      }

      const updatedArticles = [...articles];
      updatedArticles[articleIndex] = updatedArticle;
      setArticles(updatedArticles);
    } catch (error) {
      console.error('Error toggling read status:', error);
    }
  }

  const updateFolders = (newFolders) => {
    setFolders(newFolders);
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            const categoryResponse = await CategoryAPI.getCategories();
            if (categoryResponse.status === 200) {
                const categories = categoryResponse.data;
                const allFolders = [];

                for(let category of categories) {
                    const feedResponse = await FeedAPI.getFeedsByCategory(category.name);
                    if (feedResponse.status === 200) {
                        allFolders.push({
                            name: category.name,
                            subscriptions: feedResponse.data
                        });
                    }
                }

                setFolders(allFolders);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();
}, []);

return (
  <ContentContext.Provider value={{ 
    action, 
    updateAction, 
    headerAction,
    updateHeaderAction,
    articles, 
    folders, 
    updateFolders, 
    starArticle, 
    markArticleAsRead,
    settings, 
    updateSettings
  }}>
    {children}
  </ContentContext.Provider>
);
}