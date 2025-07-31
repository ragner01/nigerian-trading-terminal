import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFileText, FiClock, FiTrendingUp, FiTrendingDown, FiAlertCircle } from 'react-icons/fi';
import newsService from '../services/newsService';

const Panel = styled(motion.div)`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #404040;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  height: 100%;
  overflow-y: auto;
`;

const PanelTitle = styled.h3`
  color: #00d4aa;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NewsItem = styled(motion.div)`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #00d4aa;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 212, 170, 0.2);
  }
`;

const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const NewsTitle = styled.h4`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  flex: 1;
`;

const NewsTime = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #888888;
  white-space: nowrap;
  margin-left: 10px;
`;

const NewsExcerpt = styled.p`
  color: #cccccc;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #333333;
`;

const NewsSource = styled.span`
  font-size: 11px;
  color: #00d4aa;
  font-weight: 600;
`;

const NewsSentiment = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: ${props => {
    if (props.$sentiment === 'positive') return '#00d4aa';
    if (props.$sentiment === 'negative') return '#ff6b6b';
    return '#888888';
  }};
`;

const MarketAlert = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AlertIcon = styled.div`
  color: #ffffff;
  font-size: 18px;
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const AlertMessage = styled.div`
  color: #ffffff;
  font-size: 12px;
  opacity: 0.9;
`;

const NewsPanel = () => {
  const [newsData, setNewsData] = useState([]);
  const [marketAlert, setMarketAlert] = useState({
    title: "Market Alert",
    message: "Connecting to real-time news feed..."
  });

  useEffect(() => {
    // Start the news service
    newsService.start();

    // Subscribe to news updates
    const handleNews = (newsItem) => {
      setNewsData(prev => [newsItem, ...prev]);
    };

    const handleAlert = (alert) => {
      setMarketAlert({
        title: alert.title,
        message: alert.message
      });
    };

    newsService.on('news', handleNews);
    newsService.on('alert', handleAlert);

    // Get initial news
    const initialNews = newsService.getNews();
    if (initialNews.length > 0) {
      setNewsData(initialNews);
    }

    // Cleanup
    return () => {
      newsService.off('news', handleNews);
      newsService.off('alert', handleAlert);
      newsService.stop();
    };
  }, []);

  return (
    <Panel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PanelTitle>
        <FiFileText />
        MARKET NEWS
      </PanelTitle>

      <MarketAlert>
        <AlertIcon>
          <FiAlertCircle />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>{marketAlert.title}</AlertTitle>
          <AlertMessage>{marketAlert.message}</AlertMessage>
        </AlertContent>
      </MarketAlert>

      {newsData.map((news, index) => (
        <NewsItem
          key={news.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <NewsHeader>
            <NewsTitle>{news.title}</NewsTitle>
            <NewsTime>
              <FiClock />
              {news.time}
            </NewsTime>
          </NewsHeader>
          
          <NewsExcerpt>{news.excerpt}</NewsExcerpt>
          
          <NewsMeta>
            <NewsSource>{news.source}</NewsSource>
            <NewsSentiment $sentiment={news.sentiment}>
              {news.sentiment === 'positive' && <FiTrendingUp />}
              {news.sentiment === 'negative' && <FiTrendingDown />}
              {news.sentiment}
            </NewsSentiment>
          </NewsMeta>
        </NewsItem>
      ))}
    </Panel>
  );
};

export default NewsPanel; 