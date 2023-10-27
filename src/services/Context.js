import React, { createContext, useContext, useState, useEffect } from 'react';
import * as CategoryAPI from './CategoryAPI'; 
import * as FeedAPI from './FeedAPI';

const ContentContext = createContext();

export const useContent = () => {
  return useContext(ContentContext);
};

// 完善fetchArticles函数来从后端获取文章数据
function fetchArticles(){};

export function ContentProvider({ children }) {
  const [action, setAction] = useState();
  const [articles, setArticles] = useState([]);
  const [folders, setFolders] = useState([]);

  const updateAction = async (newAction) => {
    setAction(newAction);
    
    const fetchedArticles = await fetchArticles(newAction);
    setArticles(fetchedArticles);
  };

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
    <ContentContext.Provider value={{ action, updateAction, articles, setArticles, folders, updateFolders }}>
      {children}
    </ContentContext.Provider>
  );
}