import { createContext, useContext, useState, useEffect} from 'react';
import * as CategoryAPI from '../api/CategoryAPI'; 
import * as FeedAPI from '../api/FeedAPI';

export const FolderContext = createContext();

export const useFolder = () => useContext(FolderContext);

export function FolderProvider({ children }) {
  const [folders, setFolders] = useState([]);
  
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
    <FolderContext.Provider value={{ folders, setFolders, updateFolders}}>
      {children}
    </FolderContext.Provider>
  );
}
