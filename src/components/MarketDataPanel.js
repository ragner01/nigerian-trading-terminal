import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiEye } from 'react-icons/fi';

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

const WatchlistSection = styled.div`
  margin-bottom: 30px;
`;

const WatchlistItem = styled(motion.div)`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #00d4aa;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 212, 170, 0.2);
  }
`;

const SymbolName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 5px;
`;

const PriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CurrentPrice = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.$isPositive ? '#00d4aa' : '#ff6b6b'};
`;

const ChangeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: ${props => props.$isPositive ? '#00d4aa' : '#ff6b6b'};
`;

const VolumeInfo = styled.div`
  font-size: 12px;
  color: #888888;
  display: flex;
  justify-content: space-between;
`;

const MarketDataSection = styled.div`
  margin-top: 20px;
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #333333;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DataLabel = styled.span`
  color: #888888;
  font-size: 14px;
`;

const DataValue = styled.span`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

const MarketDataPanel = ({ marketData, watchlist, onSymbolSelect, currentSymbol }) => {
  return (
    <Panel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PanelTitle>
        <FiEye />
        MARKET DATA
      </PanelTitle>
      
      <WatchlistSection>
        <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>WATCHLIST</h4>
        {watchlist?.map((symbol, index) => {
          const item = marketData?.find(stock => stock.symbol === symbol);
          if (!item) return null;
          
          return (
            <WatchlistItem
              key={symbol}
              onClick={() => onSymbolSelect(symbol)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                borderColor: currentSymbol === symbol ? '#00d4aa' : '#404040'
              }}
            >
              <SymbolName>{symbol}</SymbolName>
                          <PriceInfo>
              <CurrentPrice $isPositive={item.change >= 0}>
                ₦{item.price.toFixed(2)}
              </CurrentPrice>
              <ChangeInfo $isPositive={item.change >= 0}>
                {item.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
              </ChangeInfo>
            </PriceInfo>
              <VolumeInfo>
                <span>Vol: {item.volume.toLocaleString()}</span>
                <span>₦{(item.price * item.volume).toLocaleString()}</span>
              </VolumeInfo>
            </WatchlistItem>
          );
        })}
      </WatchlistSection>
      
      <MarketDataSection>
        <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>MARKET OVERVIEW</h4>
        {marketData && marketData.length > 0 && (
          <>
            <DataRow>
              <DataLabel>All Share Index</DataLabel>
              <DataValue>₦{(marketData.reduce((sum, stock) => sum + stock.price, 0) / marketData.length).toLocaleString()}</DataValue>
            </DataRow>
            <DataRow>
              <DataLabel>Market Cap</DataLabel>
              <DataValue>₦{marketData.reduce((sum, stock) => sum + (stock.price * stock.volume), 0).toLocaleString()}</DataValue>
            </DataRow>
            <DataRow>
              <DataLabel>Total Volume</DataLabel>
              <DataValue>{marketData.reduce((sum, stock) => sum + stock.volume, 0).toLocaleString()}</DataValue>
            </DataRow>
            <DataRow>
              <DataLabel>Advancers</DataLabel>
              <DataValue style={{ color: '#00d4aa' }}>{marketData.filter(stock => stock.change >= 0).length}</DataValue>
            </DataRow>
            <DataRow>
              <DataLabel>Decliners</DataLabel>
              <DataValue style={{ color: '#ff6b6b' }}>{marketData.filter(stock => stock.change < 0).length}</DataValue>
            </DataRow>
          </>
        )}
      </MarketDataSection>
    </Panel>
  );
};

export default MarketDataPanel; 