import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiShoppingCart, FiPackage } from 'react-icons/fi';

const Panel = styled(motion.div)`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #404040;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  height: 400px;
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

const OrderForm = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const FormTitle = styled.h4`
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  color: #888888;
  font-size: 12px;
  margin-bottom: 5px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #404040;
  border-radius: 6px;
  padding: 10px 12px;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 2px rgba(0, 212, 170, 0.2);
  }
  
  &::placeholder {
    color: #666666;
  }
`;

const Select = styled.select`
  width: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #404040;
  border-radius: 6px;
  padding: 10px 12px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 2px rgba(0, 212, 170, 0.2);
  }
  
  option {
    background: #1a1a1a;
    color: #ffffff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const BuyButton = styled(motion.button)`
  flex: 1;
  background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
  color: #1a1a1a;
  font-weight: 700;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 212, 170, 0.4);
  }
`;

const SellButton = styled(motion.button)`
  flex: 1;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: #ffffff;
  font-weight: 700;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
  }
`;

const PositionsSection = styled.div`
  margin-top: 20px;
`;

const PositionItem = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PositionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const PositionSymbol = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;

const PositionDetails = styled.div`
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #888888;
`;

const PositionValue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
`;

const PositionPnl = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$isPositive ? '#00d4aa' : '#ff6b6b'};
`;

const TradingPanel = ({ symbol, positions, balance, onPlaceOrder }) => {
  const [orderData, setOrderData] = useState({
    symbol: symbol,
    type: 'MARKET',
    side: 'BUY',
    quantity: '',
    price: ''
  });

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOrderSubmit = (side) => {
    const order = {
      ...orderData,
      side: side,
      timestamp: new Date().toISOString()
    };
    onPlaceOrder(order);
    
    // Reset form
    setOrderData(prev => ({
      ...prev,
      quantity: '',
      price: ''
    }));
  };

  return (
    <Panel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PanelTitle>
        <FiDollarSign />
        TRADING
        {balance && (
          <span style={{ 
            marginLeft: 'auto', 
            fontSize: '14px', 
            color: '#00d4aa',
            fontWeight: '600'
          }}>
            Balance: ₦{balance.toLocaleString()}
          </span>
        )}
      </PanelTitle>

      <OrderForm>
        <FormTitle>
          <FiShoppingCart />
          PLACE ORDER
        </FormTitle>
        
        <FormRow>
          <FormGroup>
            <Label>Symbol</Label>
            <Input
              type="text"
              value={orderData.symbol}
              onChange={(e) => handleInputChange('symbol', e.target.value)}
              placeholder="Enter symbol"
            />
          </FormGroup>
          <FormGroup>
            <Label>Order Type</Label>
            <Select
              value={orderData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <option value="MARKET">Market</option>
              <option value="LIMIT">Limit</option>
              <option value="STOP">Stop</option>
            </Select>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={orderData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Enter quantity"
            />
          </FormGroup>
          <FormGroup>
            <Label>Price (₦)</Label>
            <Input
              type="number"
              value={orderData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Enter price"
              disabled={orderData.type === 'MARKET'}
            />
          </FormGroup>
        </FormRow>

        <ButtonGroup>
          <BuyButton
            onClick={() => handleOrderSubmit('BUY')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiTrendingUp />
            BUY
          </BuyButton>
          <SellButton
            onClick={() => handleOrderSubmit('SELL')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiTrendingDown />
            SELL
          </SellButton>
        </ButtonGroup>
      </OrderForm>

      <PositionsSection>
        <h4 style={{ color: '#ffffff', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPackage />
          POSITIONS
        </h4>
        {positions?.map((position, index) => (
          <PositionItem key={`position-${index}`}>
            <PositionInfo>
              <PositionSymbol>{position.symbol}</PositionSymbol>
              <PositionDetails>
                <span>Qty: {position.quantity}</span>
                <span>Avg: ₦{(position.avgPrice || position.averagePrice || 0).toFixed(2)}</span>
              </PositionDetails>
            </PositionInfo>
            <PositionValue>
              <span style={{ color: '#888888', fontSize: '12px' }}>
                ₦{(position.quantity * (position.currentPrice || 0)).toLocaleString()}
              </span>
              <PositionPnl $isPositive={(position.pnl || 0) >= 0}>
                {(position.pnl || 0) >= 0 ? '+' : ''}₦{(position.pnl || 0).toFixed(2)}
              </PositionPnl>
            </PositionValue>
          </PositionItem>
        ))}
        {(!positions || positions.length === 0) && (
          <div style={{ textAlign: 'center', color: '#666666', padding: '20px' }}>
            No open positions
          </div>
        )}
      </PositionsSection>
    </Panel>
  );
};

export default TradingPanel; 