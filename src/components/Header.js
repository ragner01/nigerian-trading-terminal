import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiBarChart, FiBell, FiUser, FiPieChart, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const HeaderContainer = styled(motion.header)`
  background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
  padding: 15px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #00d4aa;
  box-shadow: 0 4px 20px rgba(0, 212, 170, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 10px 15px;
    position: relative;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const LogoText = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: #00d4aa;
  text-shadow: 0 0 20px rgba(0, 212, 170, 0.6);
  letter-spacing: 2px;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const TerminalText = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ToolbarControls = styled.nav`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ToolbarButton = styled(motion.button)`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border: 1px solid #404040;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-family: 'Roboto', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
    color: #1a1a1a;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 212, 170, 0.4);
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 12px;
    gap: 4px;
    flex: 1;
    min-width: 0;
    justify-content: center;
  }
`;

const ThemeToggle = styled(motion.button)`
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 18px;
  cursor: pointer;
  margin-left: 20px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover {
    background: ${({ theme }) => theme.accentGradient};
    color: #1a1a1a;
  }
  
  @media (max-width: 768px) {
    margin-left: 0;
    font-size: 16px;
    padding: 6px 10px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const UserText = styled.span`
  font-size: 14px;
  color: #cccccc;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const CloseButton = styled(motion.button)`
  background: #e74c3c;
  color: #ffffff;
  font-weight: bold;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c0392b;
    transform: scale(1.05);
  }
`;

const HamburgerButton = styled(motion.button)`
  background: transparent;
  color: #ffffff;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  padding: 20px;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const MobileMenuTitle = styled.h2`
  color: #00d4aa;
  font-size: 20px;
  font-weight: 700;
`;

const MobileNavItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MobileNavItem = styled(motion.button)`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  padding: 15px 20px;
  border: 1px solid #404040;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:hover {
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
    color: #1a1a1a;
    transform: translateY(-2px);
  }
`;

const Header = ({ onNavigate, currentView, onThemeToggle, themeMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close the terminal?')) {
      window.close();
    }
  };

  const handleNavigation = (view) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <HeaderContainer
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LogoSection>
          <LogoText>NIGERIAN</LogoText>
          <TerminalText>TRADING TERMINAL</TerminalText>
        </LogoSection>
        
        <ToolbarControls>
          <ToolbarButton
            onClick={() => handleNavigation('market')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: currentView === 'market' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
              color: currentView === 'market' ? '#1a1a1a' : undefined
            }}
          >
            <FiTrendingUp />
            MARKET DATA
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleNavigation('trading')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: currentView === 'trading' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
              color: currentView === 'trading' ? '#1a1a1a' : undefined
            }}
          >
            <FiDollarSign />
            TRADING
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleNavigation('analytics')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: currentView === 'analytics' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
              color: currentView === 'analytics' ? '#1a1a1a' : undefined
            }}
          >
            <FiBarChart />
            ANALYTICS
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleNavigation('alerts')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: currentView === 'alerts' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
              color: currentView === 'alerts' ? '#1a1a1a' : undefined
            }}
          >
            <FiBell />
            ALERTS
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleNavigation('portfolio')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: currentView === 'portfolio' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
              color: currentView === 'portfolio' ? '#1a1a1a' : undefined
            }}
          >
            <FiPieChart />
            PORTFOLIO
          </ToolbarButton>
          <ThemeToggle
            onClick={onThemeToggle}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            {themeMode === 'dark' ? <FiSun /> : <FiMoon />} {themeMode === 'dark' ? 'Day' : 'Night'}
          </ThemeToggle>
        </ToolbarControls>
        
        <UserSection>
          <UserText>
            <FiUser style={{ marginRight: '5px' }} />
            USER: TRADER001
          </UserText>
          <CloseButton
            onClick={handleClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            X
          </CloseButton>
          <HamburgerButton
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMenu />
          </HamburgerButton>
        </UserSection>
      </HeaderContainer>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <MobileMenuHeader>
            <MobileMenuTitle>Menu</MobileMenuTitle>
            <HamburgerButton onClick={toggleMobileMenu}>
              <FiX />
            </HamburgerButton>
          </MobileMenuHeader>
          
          <MobileNavItems>
            <MobileNavItem
              onClick={() => handleNavigation('market')}
              style={{
                background: currentView === 'market' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
                color: currentView === 'market' ? '#1a1a1a' : undefined
              }}
            >
              <FiTrendingUp />
              MARKET DATA
            </MobileNavItem>
            <MobileNavItem
              onClick={() => handleNavigation('trading')}
              style={{
                background: currentView === 'trading' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
                color: currentView === 'trading' ? '#1a1a1a' : undefined
              }}
            >
              <FiDollarSign />
              TRADING
            </MobileNavItem>
            <MobileNavItem
              onClick={() => handleNavigation('analytics')}
              style={{
                background: currentView === 'analytics' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
                color: currentView === 'analytics' ? '#1a1a1a' : undefined
              }}
            >
              <FiBarChart />
              ANALYTICS
            </MobileNavItem>
            <MobileNavItem
              onClick={() => handleNavigation('alerts')}
              style={{
                background: currentView === 'alerts' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
                color: currentView === 'alerts' ? '#1a1a1a' : undefined
              }}
            >
              <FiBell />
              ALERTS
            </MobileNavItem>
            <MobileNavItem
              onClick={() => handleNavigation('portfolio')}
              style={{
                background: currentView === 'portfolio' ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)' : undefined,
                color: currentView === 'portfolio' ? '#1a1a1a' : undefined
              }}
            >
              <FiPieChart />
              PORTFOLIO
            </MobileNavItem>
            <MobileNavItem onClick={onThemeToggle}>
              {themeMode === 'dark' ? <FiSun /> : <FiMoon />}
              {themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </MobileNavItem>
          </MobileNavItems>
        </MobileMenu>
      )}
    </>
  );
};

export default Header; 