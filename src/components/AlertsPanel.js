import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiBell, FiAlertCircle, FiCheckCircle, FiXCircle, FiPlus, FiSettings } from 'react-icons/fi';
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

const AlertSection = styled.div`
  margin-bottom: 25px;
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

const AlertItem = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  position: relative;
  border-left: 4px solid ${props => {
    if (props.type === 'critical') return '#ff6b6b';
    if (props.type === 'warning') return '#f39c12';
    if (props.type === 'info') return '#00d4aa';
    return '#888888';
  }};
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const AlertTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
`;

const AlertTime = styled.div`
  font-size: 11px;
  color: #888888;
  margin-left: 10px;
`;

const AlertMessage = styled.div`
  font-size: 12px;
  color: #cccccc;
  line-height: 1.4;
  margin-bottom: 10px;
`;

const AlertActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 10px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
    color: #1a1a1a;
  }
`;

const AddAlertButton = styled(motion.button)`
  background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
  color: #1a1a1a;
  font-weight: 600;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 212, 170, 0.4);
  }
`;

const AlertForm = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
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
  padding: 8px 12px;
  color: #ffffff;
  font-size: 12px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 2px rgba(0, 212, 170, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #404040;
  border-radius: 6px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 12px;
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

const AlertsPanel = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Subscribe to real-time alerts
    const handleAlert = (alert) => {
      setAlerts(prev => [alert, ...prev]);
    };

    newsService.on('alert', handleAlert);

    // Get initial alerts
    const initialAlerts = newsService.getAlerts();
    if (initialAlerts.length > 0) {
      setAlerts(initialAlerts);
    }

    // Cleanup
    return () => {
      newsService.off('alert', handleAlert);
    };
  }, []);

  const [newAlert, setNewAlert] = useState({
    symbol: '',
    alertType: 'price',
    condition: 'above',
    price: '',
    message: ''
  });

  const handleAddAlert = () => {
    if (newAlert.symbol && newAlert.price) {
      const alert = {
        id: Date.now(),
        type: 'info',
        title: `${newAlert.alertType === 'price' ? 'Price' : 'Volume'} Alert: ${newAlert.symbol}`,
        message: newAlert.message || `${newAlert.symbol} ${newAlert.condition} ₦${newAlert.price}`,
        time: 'Just now',
        symbol: newAlert.symbol,
        price: parseFloat(newAlert.price)
      };
      
      setAlerts([alert, ...alerts]);
      setNewAlert({ symbol: '', alertType: 'price', condition: 'above', price: '', message: '' });
      setShowAddForm(false);
    }
  };

  const dismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <Panel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PanelTitle>
        <FiBell />
        MARKET ALERTS
      </PanelTitle>

      <AddAlertButton
        onClick={() => setShowAddForm(!showAddForm)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FiPlus />
        ADD NEW ALERT
      </AddAlertButton>

      {showAddForm && (
        <AlertForm>
          <SectionTitle>
            <FiSettings />
            CREATE ALERT
          </SectionTitle>
          <FormRow>
            <FormGroup>
              <Label>Symbol</Label>
              <Input
                type="text"
                value={newAlert.symbol}
                onChange={(e) => setNewAlert({...newAlert, symbol: e.target.value})}
                placeholder="e.g., MTNN"
              />
            </FormGroup>
            <FormGroup>
              <Label>Alert Type</Label>
              <Select
                value={newAlert.alertType}
                onChange={(e) => setNewAlert({...newAlert, alertType: e.target.value})}
              >
                <option value="price">Price Alert</option>
                <option value="volume">Volume Alert</option>
                <option value="technical">Technical Alert</option>
              </Select>
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label>Condition</Label>
              <Select
                value={newAlert.condition}
                onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
                <option value="equals">Equals</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Price (₦)</Label>
              <Input
                type="number"
                value={newAlert.price}
                onChange={(e) => setNewAlert({...newAlert, price: e.target.value})}
                placeholder="0.00"
              />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label>Message (Optional)</Label>
              <Input
                type="text"
                value={newAlert.message}
                onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                placeholder="Custom alert message"
              />
            </FormGroup>
          </FormRow>
          <AlertActions>
            <ActionButton
              onClick={handleAddAlert}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CREATE ALERT
            </ActionButton>
            <ActionButton
              onClick={() => setShowAddForm(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CANCEL
            </ActionButton>
          </AlertActions>
        </AlertForm>
      )}

      <AlertSection>
        <SectionTitle>
          <FiAlertCircle />
          ACTIVE ALERTS ({alerts.length})
        </SectionTitle>
        {alerts.map((alert) => (
          <AlertItem key={alert.id} type={alert.type}>
            <AlertHeader>
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertTime>{alert.time}</AlertTime>
            </AlertHeader>
            <AlertMessage>{alert.message}</AlertMessage>
            <AlertActions>
              <ActionButton
                onClick={() => dismissAlert(alert.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiXCircle style={{ marginRight: '5px' }} />
                DISMISS
              </ActionButton>
              <ActionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCheckCircle style={{ marginRight: '5px' }} />
                MARK READ
              </ActionButton>
            </AlertActions>
          </AlertItem>
        ))}
      </AlertSection>
    </Panel>
  );
};

export default AlertsPanel; 