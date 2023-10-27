import React, {useEffect, useState, useCallback} from 'react';
import { Empty, Layout } from 'antd';
import BGicon from '../assets/icons/emptyBG.svg';
import CardView from '../components/Content/CardView';
import ArticleAPI from '../services/ArticleAPI';
import {useContent } from '../services/Context' 
import Account from '../components/Content/Account';
import Settings from '../components/Content/Settings';
import RSSHeader from '../components/Content/RSSHeader';
import TitleView from '../components/Content/TitleView';
import MgzView from '../components/Content/MgzView';
import Explore from '../components/Content/Explore';


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

  const { action } = useContent();
  const [allarticles, setAllArticles] = useState([]); 
  const [articles, setArticles] = useState([]);
  const [viewType, setViewType] = useState('cards');
  const showTitlesOnlyView = () => setViewType('titlesOnly');
  const showMagazineView = () => setViewType('magazine');
  const showCardsView = () => setViewType('cards');

  
  const AllItems = useCallback(() => {
    ArticleAPI.getAllItems()
      .then(data => {
        if (Array.isArray(data)) {
          setAllArticles(data);
        }
      })
      .catch(error => console.error('Error fetching all items:', error));
  }, []);
  
  const FeedItems = useCallback((fid) => {
    ArticleAPI.getFeed(fid)
    .then(data => {
      console.log("data:", data); 
      if (Array.isArray(data)) {
        setArticles(data);
      }
    })
      .catch(error => console.error('Error fetching feed items:', error));
  }, []);
  
  useEffect(() => {
    switch (action) {
      case 'all':
        AllItems();
        break;
      case 'subscriptions':
        FeedItems(fid);
        break;
      default:
        break;
    }
  }, [action, fid, AllItems, FeedItems]);
  
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
      case 'all':
        if (!allarticles || allarticles.length === 0) return <None />;
        return renderArticles(allarticles); 
      case 'unread':
        if (!allarticles || allarticles.length === 0) return <None />; 
        return renderArticles(allarticles);
      case 'star':
        if (!allarticles || allarticles.length === 0) return <None />; 
        return renderArticles(allarticles);
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
        onShowTitlesOnly={showTitlesOnlyView} 
        onShowMagazine={showMagazineView} 
        onShowCards={showCardsView}
      />
      <div style={{ overflowY: 'auto', height: 'calc(100vh - 64px - 53px)' }}>
        {renderContent()}
      </div>
    </AntContent>
  );
}
