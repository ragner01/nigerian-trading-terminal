import { useState, useEffect, useCallback } from 'react';
import realTimeDataService from '../services/realtimeData';

export const useTradingData = () => {
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(1000000); // ₦1M starting balance
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with some sample positions
  useEffect(() => {
    const samplePositions = [
      {
        symbol: 'MTNN',
        quantity: 100,
        avgPrice: 152.30,
        currentPrice: 152.30,
        pnl: 0,
        pnlPercent: 0,
        lastUpdate: new Date()
      },
      {
        symbol: 'ZENITH',
        quantity: 500,
        avgPrice: 33.10,
        currentPrice: 33.10,
        pnl: 0,
        pnlPercent: 0,
        lastUpdate: new Date()
      },
      {
        symbol: 'DANGCEM',
        quantity: 50,
        avgPrice: 278.50,
        currentPrice: 278.50,
        pnl: 0,
        pnlPercent: 0,
        lastUpdate: new Date()
      }
    ];
    setPositions(samplePositions);
  }, []);

  // Update positions with real-time prices
  const updatePositions = useCallback(() => {
    setPositions(prevPositions => 
      prevPositions.map(position => {
        const stockData = realTimeDataService.getStockData(position.symbol);
        if (stockData) {
          const currentPrice = stockData.price;
          const pnl = (currentPrice - position.avgPrice) * position.quantity;
          const pnlPercent = ((currentPrice - position.avgPrice) / position.avgPrice) * 100;
          
          return {
            ...position,
            currentPrice,
            pnl: parseFloat(pnl.toFixed(2)),
            pnlPercent: parseFloat(pnlPercent.toFixed(2)),
            lastUpdate: new Date()
          };
        }
        return position;
      })
    );
  }, []);

  // Handle real-time price updates
  const handlePriceUpdate = useCallback((update) => {
    setPositions(prevPositions => 
      prevPositions.map(position => {
        if (position.symbol === update.symbol) {
          const currentPrice = update.data.price;
          const pnl = (currentPrice - position.avgPrice) * position.quantity;
          const pnlPercent = ((currentPrice - position.avgPrice) / position.avgPrice) * 100;
          
          return {
            ...position,
            currentPrice,
            pnl: parseFloat(pnl.toFixed(2)),
            pnlPercent: parseFloat(pnlPercent.toFixed(2)),
            lastUpdate: new Date()
          };
        }
        return position;
      })
    );
  }, []);

  // Place order
  const placeOrder = useCallback((orderData) => {
    setLoading(true);
    setError(null);

    try {
      const { symbol, type, quantity, price } = orderData;
      const stockData = realTimeDataService.getStockData(symbol);
      
      if (!stockData) {
        throw new Error('Stock not found');
      }

      const order = {
        id: Date.now(),
        symbol,
        type, // 'buy' or 'sell'
        quantity,
        price: price || stockData.price,
        status: 'pending',
        timestamp: new Date()
      };

      setOrders(prev => [order, ...prev]);

      // Simulate order execution
      setTimeout(() => {
        setOrders(prev => 
          prev.map(o => 
            o.id === order.id 
              ? { ...o, status: 'executed' }
              : o
          )
        );

        // Update positions if buy order
        if (type === 'buy') {
          const totalCost = order.price * order.quantity;
          if (totalCost <= balance) {
            setBalance(prev => prev - totalCost);
            
            setPositions(prev => {
              const existingPosition = prev.find(p => p.symbol === symbol);
              if (existingPosition) {
                // Update existing position
                const totalQuantity = existingPosition.quantity + order.quantity;
                const totalValue = (existingPosition.avgPrice * existingPosition.quantity) + (order.price * order.quantity);
                const newAvgPrice = totalValue / totalQuantity;
                
                return prev.map(p => 
                  p.symbol === symbol 
                    ? { ...p, quantity: totalQuantity, avgPrice: parseFloat(newAvgPrice.toFixed(2)) }
                    : p
                );
              } else {
                // Add new position
                return [...prev, {
                  symbol,
                  quantity: order.quantity,
                  avgPrice: order.price,
                  currentPrice: order.price,
                  pnl: 0,
                  pnlPercent: 0,
                  lastUpdate: new Date()
                }];
              }
            });
          } else {
            setError('Insufficient balance');
          }
        } else if (type === 'sell') {
          // Handle sell order
          setPositions(prev => {
            const existingPosition = prev.find(p => p.symbol === symbol);
            if (existingPosition && existingPosition.quantity >= order.quantity) {
              const remainingQuantity = existingPosition.quantity - order.quantity;
              const saleValue = order.price * order.quantity;
              
              setBalance(prev => prev + saleValue);
              
              if (remainingQuantity === 0) {
                return prev.filter(p => p.symbol !== symbol);
              } else {
                return prev.map(p => 
                  p.symbol === symbol 
                    ? { ...p, quantity: remainingQuantity }
                    : p
                );
              }
            } else {
              setError('Insufficient shares to sell');
              return prev;
            }
          });
        }
      }, 1000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [balance]);

  // Subscribe to real-time updates
  useEffect(() => {
    realTimeDataService.on('priceUpdate', handlePriceUpdate);
    
    // Update positions every 5 seconds
    const interval = setInterval(updatePositions, 5000);
    
    return () => {
      realTimeDataService.off('priceUpdate', handlePriceUpdate);
      clearInterval(interval);
    };
  }, [handlePriceUpdate, updatePositions]);

  return {
    positions,
    orders,
    balance,
    loading,
    error,
    placeOrder,
    updatePositions
  };
}; 