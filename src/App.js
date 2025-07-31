import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import MarketDataPanel from './components/MarketDataPanel';
import ChartPanel from './components/ChartPanel';
import TradingPanel from './components/TradingPanel';
import NewsPanel from './components/NewsPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import AlertsPanel from './components/AlertsPanel';
import PortfolioPanel from './components/PortfolioPanel';
import StatusBar from './components/StatusBar';
import { useMarketData } from './hooks/useMarketData';
import { useTradingData } from './hooks/useTradingData';
import { lightTheme, darkTheme } from './theme';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  gap: 15px;
  padding: 15px;
  min-height: calc(100vh - 120px);
  
  @media (max-width: 1200px) {
    flex-direction: column;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    gap: 10px;
  }
`;

const LeftPanel = styled(motion.aside)`
  width: 300px;
  
  @media (max-width: 1200px) {
    width: 100%;
  }
`;

const CenterPanel = styled(motion.section)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 600px;
`;

const RightPanel = styled(motion.aside)`
  width: 280px;
  
  @media (max-width: 1200px) {
    width: 100%;
  }
`;

function App() {
  const [currentSymbol, setCurrentSymbol] = useState('MTNN');
  const [selectedPeriod, setSelectedPeriod] = useState('1D');
  const [currentView, setCurrentView] = useState('market');
  const [theme, setTheme] = useState('dark');

  const { marketData, watchlist, updateMarketData } = useMarketData();
  const { positions, balance, placeOrder } = useTradingData();

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        updateMarketData();
      } catch (error) {
        console.error('Error updating market data:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [updateMarketData]);

  const handleSymbolSelect = (symbol) => {
    setCurrentSymbol(symbol);
  };

  const handleOrderPlacement = (orderData) => {
    placeOrder(orderData);
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <AppContainer>
        <Header onNavigate={handleNavigation} currentView={currentView} onThemeToggle={handleThemeToggle} themeMode={theme} />
      
        <MainContent>
          <AnimatePresence mode="wait">
            {currentView === 'market' && (
              <>
                <LeftPanel
                  key="left-panel"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <MarketDataPanel
                    marketData={marketData}
                    watchlist={watchlist}
                    onSymbolSelect={handleSymbolSelect}
                    currentSymbol={currentSymbol}
                  />
                </LeftPanel>

                <CenterPanel
                  key="center-panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <ChartPanel
                    symbol={currentSymbol}
                    period={selectedPeriod}
                    onPeriodChange={setSelectedPeriod}
                  />
                  <TradingPanel
                    symbol={currentSymbol}
                    positions={positions}
                    balance={balance}
                    onPlaceOrder={handleOrderPlacement}
                  />
                </CenterPanel>

                <RightPanel
                  key="right-panel"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <NewsPanel />
                </RightPanel>
              </>
            )}

            {currentView === 'trading' && (
              <motion.div
                key="trading-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', height: '100%' }}
              >
                <TradingPanel
                  symbol={currentSymbol}
                  positions={positions}
                  balance={balance}
                  onPlaceOrder={handleOrderPlacement}
                />
              </motion.div>
            )}

            {currentView === 'analytics' && (
              <motion.div
                key="analytics-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', height: '100%' }}
              >
                <AnalyticsPanel symbol={currentSymbol} />
              </motion.div>
            )}

            {currentView === 'alerts' && (
              <motion.div
                key="alerts-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', height: '100%' }}
              >
                <AlertsPanel />
              </motion.div>
            )}

            {currentView === 'portfolio' && (
              <motion.div
                key="portfolio-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', height: '100%' }}
              >
                <PortfolioPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </MainContent>

        <StatusBar onNavigate={handleNavigation} currentView={currentView} />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App; 