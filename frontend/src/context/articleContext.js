import { createContext, useContext, useState } from 'react';
import ArticleAPI from '../api/ArticleAPI';

export const ArticleContext = createContext();

export const useArticle = () => useContext(ArticleContext);

export function ArticleProvider({ children }) {
  const [articles, setArticles] = useState();
    
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

  return (
    <ArticleContext.Provider value={{ articles, setArticles, starArticle, markArticleAsRead}}>
      {children}
    </ArticleContext.Provider>
  );
}
