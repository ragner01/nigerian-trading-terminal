import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiBarChart, FiTrendingUp, FiPieChart, FiTarget, FiActivity } from 'react-icons/fi';

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

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AnalyticsCard = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 15px;
`;

const CardTitle = styled.h4`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IndicatorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const Indicator = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #404040;
  border-radius: 6px;
  padding: 10px;
  text-align: center;
`;

const IndicatorLabel = styled.div`
  font-size: 10px;
  color: #888888;
  margin-bottom: 5px;
`;

const IndicatorValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => {
    if (props.type === 'positive') return '#00d4aa';
    if (props.type === 'negative') return '#ff6b6b';
    return '#ffffff';
  }};
`;

const PortfolioSection = styled.div`
  margin-top: 20px;
`;

const PortfolioItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #333333;
  
  &:last-child {
    border-bottom: none;
  }
`;

const PortfolioInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const PortfolioName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const PortfolioDetails = styled.span`
  font-size: 12px;
  color: #888888;
`;

const PortfolioValue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
`;

const PortfolioAmount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const PortfolioChange = styled.span`
  font-size: 12px;
  color: ${props => props.isPositive ? '#00d4aa' : '#ff6b6b'};
`;

const MarketInsights = styled.div`
  margin-top: 20px;
`;

const InsightItem = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
`;

const InsightTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
`;

const InsightDescription = styled.div`
  font-size: 12px;
  color: #cccccc;
  line-height: 1.4;
`;

const AnalyticsPanel = ({ symbol }) => {
  const analyticsData = {
    rsi: 65.4,
    macd: 2.34,
    bollinger: { upper: 250.2, lower: 235.8, middle: 243.0 },
    movingAverages: { sma20: 242.5, sma50: 238.2, ema12: 244.1 },
    support: 235.0,
    resistance: 250.0,
    volume: { avg: 1250000, current: 1450000 },
    volatility: 0.025
  };

  const [portfolioData] = useState([
    { name: 'Total Portfolio', value: 1250000, change: 5.2, isPositive: true },
    { name: 'Cash Balance', value: 250000, change: 0, isPositive: true },
    { name: 'Invested Amount', value: 1000000, change: 6.8, isPositive: true },
    { name: 'Unrealized P&L', value: 68000, change: 6.8, isPositive: true }
  ]);

  const [marketInsights] = useState([
    {
      title: 'Strong Buy Signal',
      description: 'RSI indicates oversold conditions with MACD showing bullish crossover. Consider accumulating positions.'
    },
    {
      title: 'Volume Analysis',
      description: 'Trading volume is 16% above average, indicating strong institutional interest in this stock.'
    },
    {
      title: 'Technical Support',
      description: 'Price is approaching key support level at ₦235.00. Watch for potential bounce or breakdown.'
    },
    {
      title: 'Market Sentiment',
      description: 'Analyst consensus shows 8 Buy, 2 Hold, 1 Sell recommendations with average target of ₦260.00.'
    }
  ]);

  return (
    <Panel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PanelTitle>
        <FiBarChart />
        TECHNICAL ANALYTICS
      </PanelTitle>

      <AnalyticsGrid>
        <AnalyticsCard>
          <CardTitle>
            <FiTarget />
            TECHNICAL INDICATORS
          </CardTitle>
          <IndicatorGrid>
            <Indicator>
              <IndicatorLabel>RSI</IndicatorLabel>
              <IndicatorValue type={analyticsData.rsi > 70 ? 'negative' : analyticsData.rsi < 30 ? 'positive' : 'neutral'}>
                {analyticsData.rsi}
              </IndicatorValue>
            </Indicator>
            <Indicator>
              <IndicatorLabel>MACD</IndicatorLabel>
              <IndicatorValue type={analyticsData.macd > 0 ? 'positive' : 'negative'}>
                {analyticsData.macd}
              </IndicatorValue>
            </Indicator>
            <Indicator>
              <IndicatorLabel>Volatility</IndicatorLabel>
              <IndicatorValue type="neutral">
                {(analyticsData.volatility * 100).toFixed(1)}%
              </IndicatorValue>
            </Indicator>
            <Indicator>
              <IndicatorLabel>Volume</IndicatorLabel>
              <IndicatorValue type="neutral">
                {(analyticsData.volume.current / 1000000).toFixed(1)}M
              </IndicatorValue>
            </Indicator>
          </IndicatorGrid>
        </AnalyticsCard>

        <AnalyticsCard>
          <CardTitle>
            <FiTrendingUp />
            MOVING AVERAGES
          </CardTitle>
          <IndicatorGrid>
            <Indicator>
              <IndicatorLabel>SMA 20</IndicatorLabel>
              <IndicatorValue type="neutral">₦{analyticsData.movingAverages.sma20.toFixed(1)}</IndicatorValue>
            </Indicator>
            <Indicator>
              <IndicatorLabel>SMA 50</IndicatorLabel>
              <IndicatorValue type="neutral">₦{analyticsData.movingAverages.sma50.toFixed(1)}</IndicatorValue>
            </Indicator>
            <Indicator>
              <IndicatorLabel>EMA 12</IndicatorLabel>
              <IndicatorValue type="neutral">₦{analyticsData.movingAverages.ema12.toFixed(1)}</IndicatorValue>
            </Indicator>
            <Indicator>
              <IndicatorLabel>Signal</IndicatorLabel>
              <IndicatorValue type="positive">BULLISH</IndicatorValue>
            </Indicator>
          </IndicatorGrid>
        </AnalyticsCard>
      </AnalyticsGrid>

      <PortfolioSection>
        <CardTitle>
          <FiPieChart />
          PORTFOLIO OVERVIEW
        </CardTitle>
        {portfolioData.map((item, index) => (
          <PortfolioItem key={index}>
            <PortfolioInfo>
              <PortfolioName>{item.name}</PortfolioName>
              <PortfolioDetails>Updated {new Date().toLocaleTimeString()}</PortfolioDetails>
            </PortfolioInfo>
            <PortfolioValue>
              <PortfolioAmount>₦{item.value.toLocaleString()}</PortfolioAmount>
              <PortfolioChange isPositive={item.isPositive}>
                {item.change > 0 ? '+' : ''}{item.change}%
              </PortfolioChange>
            </PortfolioValue>
          </PortfolioItem>
        ))}
      </PortfolioSection>

      <MarketInsights>
        <CardTitle>
          <FiActivity />
          MARKET INSIGHTS
        </CardTitle>
        {marketInsights.map((insight, index) => (
          <InsightItem key={index}>
            <InsightTitle>{insight.title}</InsightTitle>
            <InsightDescription>{insight.description}</InsightDescription>
          </InsightItem>
        ))}
      </MarketInsights>
    </Panel>
  );
};

export default AnalyticsPanel; 