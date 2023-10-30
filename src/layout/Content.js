import React, {useEffect, useState} from 'react';
import { Empty, Layout } from 'antd';
import BGicon from '../assets/icons/emptyBG.svg';
import CardView from '../components/Content/CardView';
import ArticleAPI from '../api/ArticleAPI';
import {useAction } from '../context/actionContext' 
import Account from '../components/Content/Account';
import Settings from '../components/Content/Settings';
import RSSHeader from '../components/Content/RSSHeader';
import TitleView from '../components/Content/TitleView';
import MgzView from '../components/Content/MgzView';
import Explore from '../components/Content/Explore';
import Help from '../components/Content/Help';
import { useSettings } from '../context/settingContext';

const { Content: AntContent } = Layout;

function None(){
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Empty
        description={false} image={BGicon} imageStyle={{fill:'white', height:'32rem', width:'32rem'}}
      />
    </div>
  );
}

export default function Content({author, fid, isDarkMode}) {
  const viewMapping = {
    1: 'cards',
    2: 'magazine',
    3: 'titlesOnly',
  };
  
  const { settings } = useSettings();
  const { action, headerAction, updateHeaderAction} = useAction();
  const [articles, setArticles] = useState([]);
  const [viewType, setViewType] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const showTitlesOnlyView = () => setViewType('titlesOnly');
  const showMagazineView = () => setViewType('magazine');
  const showCardsView = () => setViewType('cards');
  const [params, setParams] = useState({});

  const handleMenuItemClick = (key) => {
    let newParams = {};
    switch (key) {
      case '1':
        setParams(newParams);
        break;
      case '2':
        newParams.updatedDuring = 'today';
        break;
      case '3':
        newParams.updatedDuring = 'week';
            break;
      case '4':
        newParams.updatedDuring = 'month';
        break;
      default:
        break;
    }
    setParams(newParams); 
  };


  useEffect(() => {
      setViewType(viewMapping[settings.default_presentation]);
  }, [settings]);

  useEffect(() => {

  setArticles([]); //important!!!

  switch (action) {
    case 'all':
      switch(headerAction){
        case 'date':
          ArticleAPI.getAllItems({updatedDuring: params.updatedDuring, order: settings.default_sort === 1 ? 'latest' : 'oldest'})
          .then(data => {
              if (Array.isArray(data)) {
                  setArticles(data);
              }
              
          })
          .catch(error => console.error('Error fetching all articles:', error));
        
      break;
        case 'read':
          ArticleAPI.markAllAsRead()
          .then(() => {
            updateHeaderAction('update');
          })
          .catch(error => console.error('Error marking all as read:', error));
          
        break;  
        case 'update':
          setTimeout(() => {
            setIsSpinning(false); 
        }, 1000);
          ArticleAPI.updateAllItems({order: settings.default_sort === 1 ? 'latest' : 'oldest'})
            .then(data => {
              if (Array.isArray(data)) {
                setArticles(data);
              }
              
            })
            .catch(error => console.error('Error updating all items:', error));
            updateHeaderAction('');
          break;
        default:
          ArticleAPI.getAllItems({order: settings.default_sort === 1 ? 'latest' : 'oldest'})
            .then(data => {
              if (Array.isArray(data)) {
                setArticles(data);
              }
              
            })
            .catch(error => console.error('Error fetching all items:', error));
            
          break;
      }
      break;

    case 'unread':
      switch(headerAction){
        case 'date':
          ArticleAPI.getAllItems({tag:'unread', updatedDuring: params.updatedDuring, order: settings.default_sort === 1 ? 'latest' : 'oldest'})
              .then(data => {
                  if (Array.isArray(data)) {
                      setArticles(data);
                  }
                  
              })
              .catch(error => console.error('Error fetching unread articles:', error));
              
          break;
        case 'read':
          ArticleAPI.markAllAsRead({ tag: 'unread'})
          .then(() => {
            updateHeaderAction('update');
          })
          .catch(error => console.error('Error marking unread as read:', error));
          
        break;
        case 'update':
          setTimeout(() => {
            setIsSpinning(false); 
        }, 1000);
          ArticleAPI.updateAllItems({ tag: 'unread', order: settings.default_sort === 1 ? 'latest' : 'oldest'})
            .then(data => {
              if (Array.isArray(data)) {
                setArticles(data);
              }
              
            })
            .catch(error => console.error('Error updating unread items:', error));
            updateHeaderAction('');
          break;
        default:
          ArticleAPI.getAllItems({ tag: 'unread', order: settings.default_sort === 1 ? 'latest' : 'oldest'})  
            .then(data => {
              if (Array.isArray(data)) {
                setArticles(data);
              }
              
            })
            .catch(error => console.error('Error fetching unread items:', error));
            
          break;
      }
      break;

    case 'star':
      switch(headerAction){
        case 'date':
                ArticleAPI.getAllItems({tag:'star', updatedDuring: params.updatedDuring, order: settings.default_sort === 1 ? 'latest' : 'oldest'})
                    .then(data => {
                        if (Array.isArray(data)) {
                            setArticles(data);
                        }
                        
                    })
                    .catch(error => console.error('Error fetching starred articles:', error));
                    
                break;
        case 'read':
          ArticleAPI.markAllAsRead({ tag: 'starred'})
              .then(() => {
                updateHeaderAction('update');
              })
              .catch(error => console.error('Error marking starred as read:', error));
              
              
            break;
        case 'update':
          setTimeout(() => {
            setIsSpinning(false); 
        }, 1000);
          ArticleAPI.updateAllItems({ tag: 'starred', order: settings.default_sort === 1 ? 'latest' : 'oldest'})
            .then(data => {
              if (Array.isArray(data)) {
                setArticles(data);
                
              }
            })
            .catch(error => console.error('Error updating starred items:', error));
            updateHeaderAction('');
          break;              
        default:
          ArticleAPI.getAllItems({ tag: 'starred', order: settings.default_sort === 1 ? 'latest' : 'oldest' })  
          .then(data => {
            if (Array.isArray(data)) {
              setArticles(data);
            }
            
          })
          .catch(error => console.error('Error fetching starred items:', error));
          
        break;
      }
      break;

    case 'subscriptions':
      switch(headerAction){
        case 'date':
          ArticleAPI.getFeed(fid, {updatedDuring: params.updatedDuring, order: settings.default_sort === 1 ? 'latest' : 'oldest'})
          .then(data => {
              if (Array.isArray(data)) {
                  setArticles(data);
              }
              
          })
          .catch(error => console.error('Error fetching single feed articles:', error));
          
      break;
        case 'read':
          ArticleAPI.markFeedAsRead(fid)
              .then(() => {
                updateHeaderAction('update');
              })
              .catch(error => console.error('Error marking feed as read:', error));
             
            break;
        case 'update':
          setTimeout(() => {
            setIsSpinning(false); 
        }, 1000);
          ArticleAPI.updateFeed(fid, {order: settings.default_sort === 1 ? 'latest' : 'oldest'})
            .then(data => {
              if (Array.isArray(data)) {
                setArticles(data);
                
              }
            })
            .catch(error => console.error('Error updating feed items:', error));
            updateHeaderAction('');
          break;
        default:
          ArticleAPI.getFeed(fid, {order: settings.default_sort === 1 ? 'latest' : 'oldest'})
          .then(data => {
            if (Array.isArray(data)) {
              setArticles(data);
            }
            
          })
          .catch(error => console.error('Error fetching feed items:', error));
          
        break;
      }
      break;

    default:
      break;
  }
}, [action, fid, headerAction, params]);

  
  const renderArticles = (articlesToShow) => {
    if (viewType === 'titlesOnly') {
      return <TitleView articles={articlesToShow} isDarkMode={isDarkMode} />;
    } else if (viewType === 'magazine') {
      return <MgzView articles={articlesToShow} isDarkMode={isDarkMode} />;
    } else {
      return <CardView articles={articlesToShow} isDarkMode={isDarkMode} />;
    }
  };

  const renderContent = () => {
    switch (action) {    
      case 'account':
        return <Account />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      case 'all':
        if (!articles || articles.length === 0) 
        return <None />;
        return renderArticles(articles); 
      case 'unread':
        if (!articles || articles.length === 0) return<None />; 
        return renderArticles(articles)
      case 'star':
        if (!articles || articles.length === 0) return <None />; 
        return renderArticles(articles);
      case 'explore':
        return <Explore />;
      case 'subscriptions':
        if (!articles || articles.length === 0) return <None />;
        return renderArticles(articles);
      default: 
        return <None />;
    }
  };
  

return (
 <AntContent style={{ height: 'calc(100vh - 64px)' }}>
      <RSSHeader 
        isDarkMode={isDarkMode} 
        action={action}
        author={author}
        fid={fid}
        articles={articles}
        setArticles={setArticles}
        onShowTitlesOnly={showTitlesOnlyView} 
        onShowMagazine={showMagazineView} 
        onShowCards={showCardsView}
        onMenuItemClick={handleMenuItemClick}
        isSpinning={isSpinning}
        setIsSpinning={setIsSpinning}
      />
      <div style={{ overflowY: 'auto', height: 'calc(100vh - 64px - 53px)' }}>
        {renderContent()}
      </div>
    </AntContent>
  );
}


