import { useState, useEffect, useCallback } from 'react';
import realTimeDataService from '../services/realtimeData';

export const useMarketData = () => {
  const [marketData, setMarketData] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    reconnectAttempts: 0,
    lastUpdate: null
  });

  const updateMarketData = useCallback((data) => {
    try {
      // Ensure data is an array and filter out any undefined items
      const validData = Array.isArray(data) ? data.filter(item => item && item.symbol) : [];
      setMarketData(validData);
      
      // Update watchlist with top 8 stocks by volume
      const topStocks = validData
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 8)
        .map(stock => stock.symbol);
      setWatchlist(topStocks);
      
      setLoading(false);
    } catch (error) {
      console.error('Error updating market data:', error);
      setError('Failed to update market data');
      setLoading(false);
    }
  }, []);

  // Connection status handling for future use

  const handlePriceUpdate = useCallback((update) => {
    setMarketData(prevData => {
      const updatedData = prevData.map(stock => 
        stock && stock.symbol === update.symbol ? { ...stock, ...update } : stock
      );
      return updatedData.filter(stock => stock && stock.symbol);
    });
  }, []);

  const handleVolumeUpdate = useCallback((update) => {
    setMarketData(prevData => {
      const updatedData = prevData.map(stock => 
        stock && stock.symbol === update.symbol 
          ? { ...stock, volume: update.volume }
          : stock
      );
      return updatedData.filter(stock => stock && stock.symbol);
    });
  }, []);

  const addToWatchlist = useCallback((symbol) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist(prev => [...prev, symbol]);
    }
  }, [watchlist]);

  const removeFromWatchlist = useCallback((symbol) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  }, []);

  useEffect(() => {
    // Connect to real-time data service
    realTimeDataService.connect();

    // Subscribe to real-time events
    realTimeDataService.on('connected', () => {
      console.log('Connected to real-time data service');
      setConnectionStatus(prev => ({ ...prev, isConnected: true }));
    });

    realTimeDataService.on('marketData', (data) => {
      // Handle both direct data and nested data structure
      const marketData = data.data || data;
      updateMarketData(marketData);
    });

    realTimeDataService.on('priceUpdate', handlePriceUpdate);
    realTimeDataService.on('volumeUpdate', handleVolumeUpdate);

    // Get initial data
    const initialData = realTimeDataService.getMarketData();
    updateMarketData(initialData);

    // Cleanup on unmount
    return () => {
      realTimeDataService.off('connected');
      realTimeDataService.off('marketData');
      realTimeDataService.off('priceUpdate');
      realTimeDataService.off('volumeUpdate');
      realTimeDataService.disconnect();
    };
  }, [updateMarketData, handlePriceUpdate, handleVolumeUpdate]);

  return {
    marketData,
    watchlist,
    loading,
    error,
    connectionStatus,
    addToWatchlist,
    removeFromWatchlist
  };
}; 