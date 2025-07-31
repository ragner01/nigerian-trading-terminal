import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiBarChart, FiTrendingUp, FiActivity } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  zoomPlugin
);

const Panel = styled(motion.div)`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #404040;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  height: 500px;
  min-height: 500px;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PanelTitle = styled.h3`
  color: #00d4aa;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
`;

const PeriodSelector = styled.div`
  display: flex;
  gap: 5px;
`;

const ChartControls = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ChartTypeButton = styled(motion.button)`
  background: ${props => props.$active ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)'};
  color: ${props => props.$active ? '#1a1a1a' : '#ffffff'};
  font-size: 10px;
  font-weight: 600;
  padding: 6px 12px;
  border: 1px solid #404040;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
    color: #1a1a1a;
  }
`;

const PeriodButton = styled(motion.button)`
  background: ${props => props.$active ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)'};
  color: ${props => props.$active ? '#1a1a1a' : '#ffffff'};
  font-size: 12px;
  font-weight: 600;
  padding: 8px 16px;
  border: 1px solid #404040;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
    color: #1a1a1a;
  }
`;

const ChartContainer = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  border: 1px solid #333333;
  border-radius: 8px;
  height: 300px;
  position: relative;
  overflow: hidden;
  padding: 20px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const PriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border-radius: 8px;
  border: 1px solid #404040;
`;

const SymbolInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SymbolName = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
`;

const SymbolDescription = styled.span`
  font-size: 12px;
  color: #888888;
`;

const PriceData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
`;

const CurrentPrice = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #00d4aa;
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #00d4aa;
`;

const TechnicalIndicators = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
`;

const Indicator = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 6px;
  padding: 10px;
  flex: 1;
  text-align: center;
`;

const IndicatorLabel = styled.div`
  font-size: 10px;
  color: #888888;
  margin-bottom: 5px;
`;

const IndicatorValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const DayViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #ffffff;
`;

const DayViewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border-radius: 8px;
  margin-bottom: 15px;
`;

const DayViewTitle = styled.h4`
  color: #00d4aa;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const DayViewStats = styled.div`
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

const DayViewChart = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
`;

const DayView = ({ symbol }) => {
  // Generate intraday data (24 hours)
  const generateIntradayData = () => {
    const data = [];
    let basePrice = 240;
    
    for (let hour = 0; hour < 24; hour++) {
      const change = (Math.random() - 0.5) * 0.02;
      basePrice = basePrice * (1 + change);
      
      data.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        price: basePrice,
        volume: Math.floor(Math.random() * 500000) + 100000,
        high: basePrice + Math.random() * 2,
        low: basePrice - Math.random() * 2
      });
    }
    
    return data;
  };

  const intradayData = generateIntradayData();
  const currentPrice = intradayData[intradayData.length - 1]?.price || 240;
  const openPrice = intradayData[0]?.price || 240;
  const change = currentPrice - openPrice;
  const changePercent = (change / openPrice) * 100;
  const high = Math.max(...intradayData.map(d => d.high));
  const low = Math.min(...intradayData.map(d => d.low));
  const volume = intradayData.reduce((sum, d) => sum + d.volume, 0);

  return (
    <DayViewContainer>
      <DayViewHeader>
        <DayViewTitle>Intraday Trading - {symbol}</DayViewTitle>
        <div style={{ fontSize: '14px', color: '#888888' }}>
          {new Date().toLocaleDateString()}
        </div>
      </DayViewHeader>

      <DayViewStats>
        <StatCard>
          <StatLabel>Open</StatLabel>
          <StatValue>₦{openPrice.toFixed(2)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>High</StatLabel>
          <StatValue>₦{high.toFixed(2)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Low</StatLabel>
          <StatValue>₦{low.toFixed(2)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Volume</StatLabel>
          <StatValue>{(volume / 1000000).toFixed(1)}M</StatValue>
        </StatCard>
      </DayViewStats>

      <DayViewChart>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', color: '#00d4aa', marginBottom: '10px' }}>
            ₦{currentPrice.toFixed(2)}
          </div>
          <div style={{ 
            fontSize: '16px', 
            color: change >= 0 ? '#00d4aa' : '#ff6b6b',
            marginBottom: '20px'
          }}>
            {change >= 0 ? '+' : ''}₦{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </div>
          <div style={{ fontSize: '14px', color: '#888888' }}>
            Intraday Chart - 24 Hour View
          </div>
        </div>
      </DayViewChart>
    </DayViewContainer>
  );
};

const ChartPanel = ({ symbol, period, onPeriodChange }) => {
  const periods = ['1D', '1W', '1M', '3M', '1Y'];
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'day'
  
  // Mock data for demonstration
  const mockPriceData = {
    currentPrice: 245.50,
    change: 12.75,
    changePercent: 5.47,
    high: 248.00,
    low: 240.25,
    volume: 1250000
  };

  const mockIndicators = {
    rsi: 65.4,
    macd: 2.34,
    bollinger: 'Upper: 250.2, Lower: 235.8'
  };

  // Generate mock chart data
  useEffect(() => {
    const generateChartData = () => {
      const dataPoints = period === '1D' ? 24 : period === '1W' ? 7 : period === '1M' ? 30 : period === '3M' ? 90 : 365;
      const labels = [];
      const prices = [];
      const volumes = [];
      
      let basePrice = 240;
      const volatility = 0.02;
      
      for (let i = 0; i < dataPoints; i++) {
        const timeLabel = period === '1D' ? `${i}:00` : 
                         period === '1W' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7] :
                         period === '1M' ? `Day ${i + 1}` :
                         period === '3M' ? `Week ${Math.floor(i / 7) + 1}` : `Month ${Math.floor(i / 30) + 1}`;
        
        labels.push(timeLabel);
        
        // Generate realistic price movement
        const change = (Math.random() - 0.5) * volatility;
        basePrice = basePrice * (1 + change);
        prices.push(basePrice);
        
        // Generate volume data
        const volume = Math.floor(Math.random() * 1000000) + 500000;
        volumes.push(volume);
      }
      
      return {
        labels,
        datasets: [
          {
            label: 'Price (₦)',
            data: prices,
            borderColor: '#00d4aa',
            backgroundColor: 'rgba(0, 212, 170, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#00d4aa',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2,
          },
          {
            label: 'Volume',
            data: volumes.map(v => v / 10000), // Scale down for display
            borderColor: '#ff6b6b',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderWidth: 1,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            yAxisID: 'volume',
          }
        ]
      };
    };
    
    setChartData(generateChartData());
  }, [period]);

    const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#cccccc',
        borderColor: '#00d4aa',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            if (context.dataset.label === 'Price (₦)') {
              return `Price: ₦${context.parsed.y.toFixed(2)}`;
            }
            return `Volume: ${(context.parsed.y * 10000).toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#888888',
          maxTicksLimit: 8,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#888888',
          callback: function(value) {
            return '₦' + value.toFixed(0);
          }
        },
      },
      volume: {
        type: 'linear',
        display: false,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <Panel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PanelHeader>
        <PanelTitle>
          <FiBarChart />
          PRICE CHART
        </PanelTitle>
        <PeriodSelector>
          {periods.map((p) => (
            <PeriodButton
              key={p}
              $active={period === p}
              onClick={() => onPeriodChange(p)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {p}
            </PeriodButton>
          ))}
        </PeriodSelector>
      </PanelHeader>

      <ChartControls>
        <ChartTypeButton
          $active={viewMode === 'chart'}
          onClick={() => setViewMode('chart')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          CHART
        </ChartTypeButton>
        <ChartTypeButton
          $active={viewMode === 'day'}
          onClick={() => setViewMode('day')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          DAY VIEW
        </ChartTypeButton>
        <ChartTypeButton
          $active={chartType === 'line'}
          onClick={() => setChartType('line')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          LINE
        </ChartTypeButton>
        <ChartTypeButton
          $active={chartType === 'bar'}
          onClick={() => setChartType('bar')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          BAR
        </ChartTypeButton>
      </ChartControls>

      <PriceInfo>
        <SymbolInfo>
          <SymbolName>{symbol}</SymbolName>
          <SymbolDescription>Nigerian Stock Exchange</SymbolDescription>
        </SymbolInfo>
        <PriceData>
          <CurrentPrice>₦{mockPriceData.currentPrice.toFixed(2)}</CurrentPrice>
          <PriceChange>
            <FiTrendingUp />
            +₦{mockPriceData.change.toFixed(2)} ({mockPriceData.changePercent.toFixed(2)}%)
          </PriceChange>
        </PriceData>
      </PriceInfo>

      <ChartContainer>
        <ChartWrapper>
          {viewMode === 'day' ? (
            <DayView symbol={symbol} />
          ) : chartData ? (
            chartType === 'bar' ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Line data={chartData} options={chartOptions} />
            )
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: '#666666'
            }}>
              <FiActivity style={{ fontSize: '48px', color: '#00d4aa', marginRight: '15px' }} />
              <div>
                <div style={{ fontSize: '16px', marginBottom: '5px' }}>
                  Loading chart for {symbol}
                </div>
                <div style={{ fontSize: '14px', color: '#888888' }}>
                  {period} Timeframe
                </div>
              </div>
            </div>
          )}
        </ChartWrapper>
      </ChartContainer>

      <TechnicalIndicators>
        <Indicator>
          <IndicatorLabel>RSI</IndicatorLabel>
          <IndicatorValue>{mockIndicators.rsi}</IndicatorValue>
        </Indicator>
        <Indicator>
          <IndicatorLabel>MACD</IndicatorLabel>
          <IndicatorValue>{mockIndicators.macd}</IndicatorValue>
        </Indicator>
        <Indicator>
          <IndicatorLabel>BOLLINGER</IndicatorLabel>
          <IndicatorValue style={{ fontSize: '10px' }}>{mockIndicators.bollinger}</IndicatorValue>
        </Indicator>
      </TechnicalIndicators>
    </Panel>
  );
};

export default ChartPanel; 