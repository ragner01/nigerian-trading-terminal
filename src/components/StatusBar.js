import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiWifi, FiClock, FiActivity, FiShield, FiDatabase } from 'react-icons/fi';

const StatusBarContainer = styled(motion.footer)`
  background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
  border-top: 2px solid #00d4aa;
  padding: 10px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #cccccc;
  box-shadow: 0 -4px 20px rgba(0, 212, 170, 0.3);
`;

const QuickActions = styled.div`
  display: flex;
  gap: 10px;
`;

const QuickActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 10px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
    color: #1a1a1a;
  }
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    gap: 10px;
    font-size: 10px;
  }
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #00d4aa;
    box-shadow: 0 2px 10px rgba(0, 212, 170, 0.2);
  }
`;

const ConnectionStatus = styled(StatusItem)`
  border-color: ${props => props.$isConnected ? '#00d4aa' : '#ff6b6b'};
  color: ${props => props.$isConnected ? '#00d4aa' : '#ff6b6b'};
`;

const SystemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #888888;
`;

const LiveIndicator = styled(motion.div)`
  width: 8px;
  height: 8px;
  background: #00d4aa;
  border-radius: 50%;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 212, 170, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(0, 212, 170, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 212, 170, 0);
    }
  }
`;

const StatusBar = ({ onNavigate, currentView }) => {
  // Static time for now to avoid errors
  const currentTime = '12:00:00';
  const currentDate = 'Mon, Jan 1, 2024';
  const [isConnected, setIsConnected] = useState(false);
  const [dataLatency, setDataLatency] = useState(0);
  const [systemStatus, setSystemStatus] = useState('CONNECTING');
  // Real-time updates tracking

  const handleQuickNav = (view) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  // Simulate real-time connection status
  useEffect(() => {
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      setSystemStatus('OPERATIONAL');
      setDataLatency(45);
    }, 2000);

    // Simulate latency updates
    const latencyInterval = setInterval(() => {
      if (isConnected) {
        setDataLatency(Math.floor(Math.random() * 100) + 20);
      }
    }, 5000);

    return () => clearInterval(latencyInterval);
  }, [isConnected]);

  return (
    <StatusBarContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StatusSection>
        <ConnectionStatus $isConnected={isConnected}>
          <FiWifi />
          {isConnected ? 'CONNECTED' : 'CONNECTING'}
        </ConnectionStatus>
        
        <StatusItem>
          <FiDatabase />
          {systemStatus}
        </StatusItem>
        
        <StatusItem>
          <FiShield />
          SECURE
        </StatusItem>
        
        <StatusItem>
          <FiActivity />
          <LiveIndicator />
          {dataLatency}ms
        </StatusItem>
      </StatusSection>

      <QuickActions>
        <QuickActionButton
          onClick={() => handleQuickNav('market')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: currentView === 'market' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
            color: currentView === 'market' ? '#1a1a1a' : undefined
          }}
        >
          MARKET
        </QuickActionButton>
        <QuickActionButton
          onClick={() => handleQuickNav('trading')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: currentView === 'trading' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
            color: currentView === 'trading' ? '#1a1a1a' : undefined
          }}
        >
          TRADE
        </QuickActionButton>
        <QuickActionButton
          onClick={() => handleQuickNav('analytics')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: currentView === 'analytics' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
            color: currentView === 'analytics' ? '#1a1a1a' : undefined
          }}
        >
          ANALYTICS
        </QuickActionButton>
        <QuickActionButton
          onClick={() => handleQuickNav('alerts')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: currentView === 'alerts' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
            color: currentView === 'alerts' ? '#1a1a1a' : undefined
          }}
        >
          ALERTS
        </QuickActionButton>
        <QuickActionButton
          onClick={() => handleQuickNav('portfolio')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: currentView === 'portfolio' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
            color: currentView === 'portfolio' ? '#1a1a1a' : undefined
          }}
        >
          PORTFOLIO
        </QuickActionButton>
      </QuickActions>

      <SystemInfo>
        <InfoItem>
          <FiClock />
          {currentTime || '--:--:--'}
        </InfoItem>
        
        <InfoItem>
          {currentDate || '-- -- --'}
        </InfoItem>
        
        <InfoItem>
          USER: TRADER001
        </InfoItem>
        
        <InfoItem>
          SESSION: ACTIVE
        </InfoItem>
      </SystemInfo>
    </StatusBarContainer>
  );
};

export default StatusBar; 