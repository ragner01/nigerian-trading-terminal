import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiPieChart, 
  FiTarget, 
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiRefreshCw,
  FiPlus,
  FiMinus
} from 'react-icons/fi';
import realTimeDataService from '../services/realtimeData';

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

const PortfolioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const PortfolioSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TotalValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
`;

const TotalChange = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  color: ${props => props.$isPositive ? '#00d4aa' : '#ff6b6b'};
`;

const PortfolioStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: #888888;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;

const HoldingsSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HoldingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HoldingItem = styled(motion.div)`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #00d4aa;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 212, 170, 0.2);
  }
`;

const HoldingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const HoldingSymbol = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;

const HoldingValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #00d4aa;
`;

const HoldingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  font-size: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DetailLabel = styled.span`
  color: #888888;
`;

const DetailValue = styled.span`
  color: #ffffff;
  font-weight: 600;
`;

const PerformanceSection = styled.div`
  margin-bottom: 20px;
`;

const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const PerformanceCard = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 15px;
`;

const CardTitle = styled.h5`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const Metric = styled.div`
  text-align: center;
`;

const MetricLabel = styled.div`
  font-size: 10px;
  color: #888888;
  margin-bottom: 3px;
`;

const MetricValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${props => {
    if (props.type === 'positive') return '#00d4aa';
    if (props.type === 'negative') return '#ff6b6b';
    return '#ffffff';
  }};
`;

const ActionsSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 6px;
  padding: 10px 15px;
  font-size: 12px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
    color: #1a1a1a;
  }
`;

const PortfolioPanel = () => {
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 2700000,
    totalChange: 145000,
    totalChangePercent: 5.67,
    cashBalance: 500000,
    investedAmount: 2200000,
    unrealizedPnL: 145000,
    realizedPnL: 45000
  });

  const [holdings, setHoldings] = useState([
    {
      symbol: 'MTNN',
      name: 'MTN Nigeria',
      quantity: 500,
      avgPrice: 520.00,
      currentPrice: 580.00,
      value: 290000,
      change: 30000,
      changePercent: 11.54,
      sector: 'Telecoms'
    },
    {
      symbol: 'DANGCEM',
      name: 'Dangote Cement',
      quantity: 200,
      avgPrice: 680.00,
      currentPrice: 720.00,
      value: 144000,
      change: 8000,
      changePercent: 5.88,
      sector: 'Construction'
    },
    {
      symbol: 'ZENITH',
      name: 'Zenith Bank',
      quantity: 1000,
      avgPrice: 45.00,
      currentPrice: 48.50,
      value: 48500,
      change: 3500,
      changePercent: 7.78,
      sector: 'Banking'
    },
    {
      symbol: 'GTCO',
      name: 'GTCO',
      quantity: 800,
      avgPrice: 38.00,
      currentPrice: 42.75,
      value: 34200,
      change: 3800,
      changePercent: 12.50,
      sector: 'Banking'
    }
  ]);

  const [performanceMetrics] = useState({
    daily: { return: 2.1, benchmark: 1.8 },
    weekly: { return: 5.2, benchmark: 4.5 },
    monthly: { return: 12.8, benchmark: 10.2 },
    yearly: { return: 28.5, benchmark: 22.1 },
    sharpeRatio: 1.85,
    beta: 0.92,
    alpha: 2.3,
    maxDrawdown: -8.5
  });

  // Update portfolio data in real-time
  useEffect(() => {
    const updatePortfolio = () => {
      const updatedHoldings = holdings.map(holding => {
        const stockData = realTimeDataService.getStockData(holding.symbol);
        if (stockData) {
          const currentPrice = stockData.price;
          const value = holding.quantity * currentPrice;
          const change = value - (holding.quantity * holding.avgPrice);
          const changePercent = (change / (holding.quantity * holding.avgPrice)) * 100;
          
          return {
            ...holding,
            currentPrice,
            value,
            change,
            changePercent
          };
        }
        return holding;
      });

      const totalValue = updatedHoldings.reduce((sum, h) => sum + h.value, 0) + portfolioData.cashBalance;
      const totalInvested = updatedHoldings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);
      const unrealizedPnL = updatedHoldings.reduce((sum, h) => sum + h.change, 0);
      const totalChange = unrealizedPnL + portfolioData.realizedPnL;
      const totalChangePercent = (totalChange / totalInvested) * 100;

      setHoldings(updatedHoldings);
      setPortfolioData(prev => ({
        ...prev,
        totalValue,
        totalChange,
        totalChangePercent,
        unrealizedPnL
      }));
    };

    // Update every 5 seconds
    const interval = setInterval(updatePortfolio, 5000);
    updatePortfolio(); // Initial update

    return () => clearInterval(interval);
  }, [holdings, portfolioData.cashBalance, portfolioData.realizedPnL]);

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <Panel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PanelTitle>
        <FiPieChart />
        PORTFOLIO OVERVIEW
      </PanelTitle>

      <PortfolioHeader>
        <PortfolioSummary>
          <TotalValue>{formatCurrency(portfolioData.totalValue)}</TotalValue>
          <TotalChange $isPositive={portfolioData.totalChange >= 0}>
            {portfolioData.totalChange >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
            {formatCurrency(portfolioData.totalChange)} ({formatPercentage(portfolioData.totalChangePercent)})
          </TotalChange>
        </PortfolioSummary>
        <div style={{ textAlign: 'right', color: '#888888', fontSize: '12px' }}>
          <div>Last Updated: {new Date().toLocaleTimeString()}</div>
          <div>Portfolio Value</div>
        </div>
      </PortfolioHeader>

      <PortfolioStats>
        <StatCard>
          <StatLabel>Cash Balance</StatLabel>
          <StatValue>{formatCurrency(portfolioData.cashBalance)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Invested Amount</StatLabel>
          <StatValue>{formatCurrency(portfolioData.investedAmount)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Unrealized P&L</StatLabel>
          <StatValue style={{ color: portfolioData.unrealizedPnL >= 0 ? '#00d4aa' : '#ff6b6b' }}>
            {formatCurrency(portfolioData.unrealizedPnL)}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Realized P&L</StatLabel>
          <StatValue style={{ color: portfolioData.realizedPnL >= 0 ? '#00d4aa' : '#ff6b6b' }}>
            {formatCurrency(portfolioData.realizedPnL)}
          </StatValue>
        </StatCard>
      </PortfolioStats>

      <ActionsSection>
        <ActionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FiPlus />
          BUY STOCK
        </ActionButton>
        <ActionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FiMinus />
          SELL STOCK
        </ActionButton>
        <ActionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FiRefreshCw />
          REFRESH
        </ActionButton>
      </ActionsSection>

      <HoldingsSection>
        <SectionTitle>
          <FiBarChart2 />
          HOLDINGS
        </SectionTitle>
        <HoldingsList>
          {holdings.map((holding, index) => (
            <HoldingItem
              key={holding.symbol}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HoldingHeader>
                <HoldingSymbol>{holding.symbol}</HoldingSymbol>
                <HoldingValue>{formatCurrency(holding.value)}</HoldingValue>
              </HoldingHeader>
              <HoldingDetails>
                <DetailItem>
                  <DetailLabel>Quantity</DetailLabel>
                  <DetailValue>{holding.quantity.toLocaleString()}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Avg Price</DetailLabel>
                  <DetailValue>₦{holding.avgPrice.toFixed(2)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Current Price</DetailLabel>
                  <DetailValue>₦{holding.currentPrice.toFixed(2)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>P&L</DetailLabel>
                  <DetailValue style={{ color: holding.change >= 0 ? '#00d4aa' : '#ff6b6b' }}>
                    {formatCurrency(holding.change)} ({formatPercentage(holding.changePercent)})
                  </DetailValue>
                </DetailItem>
              </HoldingDetails>
            </HoldingItem>
          ))}
        </HoldingsList>
      </HoldingsSection>

      <PerformanceSection>
        <SectionTitle>
          <FiTarget />
          PERFORMANCE METRICS
        </SectionTitle>
        <PerformanceGrid>
          <PerformanceCard>
            <CardTitle>
              <FiCalendar />
              RETURNS
            </CardTitle>
            <MetricGrid>
              <Metric>
                <MetricLabel>Daily</MetricLabel>
                <MetricValue type={performanceMetrics.daily.return >= performanceMetrics.daily.benchmark ? 'positive' : 'negative'}>
                  {performanceMetrics.daily.return}%
                </MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>Weekly</MetricLabel>
                <MetricValue type={performanceMetrics.weekly.return >= performanceMetrics.weekly.benchmark ? 'positive' : 'negative'}>
                  {performanceMetrics.weekly.return}%
                </MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>Monthly</MetricLabel>
                <MetricValue type={performanceMetrics.monthly.return >= performanceMetrics.monthly.benchmark ? 'positive' : 'negative'}>
                  {performanceMetrics.monthly.return}%
                </MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>Yearly</MetricLabel>
                <MetricValue type={performanceMetrics.yearly.return >= performanceMetrics.yearly.benchmark ? 'positive' : 'negative'}>
                  {performanceMetrics.yearly.return}%
                </MetricValue>
              </Metric>
            </MetricGrid>
          </PerformanceCard>

          <PerformanceCard>
            <CardTitle>
              <FiActivity />
              RISK METRICS
            </CardTitle>
            <MetricGrid>
              <Metric>
                <MetricLabel>Sharpe Ratio</MetricLabel>
                <MetricValue type="positive">{performanceMetrics.sharpeRatio}</MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>Beta</MetricLabel>
                <MetricValue type="neutral">{performanceMetrics.beta}</MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>Alpha</MetricLabel>
                <MetricValue type="positive">{performanceMetrics.alpha}%</MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>Max Drawdown</MetricLabel>
                <MetricValue type="negative">{performanceMetrics.maxDrawdown}%</MetricValue>
              </Metric>
            </MetricGrid>
          </PerformanceCard>
        </PerformanceGrid>
      </PerformanceSection>
    </Panel>
  );
};

export default PortfolioPanel; 