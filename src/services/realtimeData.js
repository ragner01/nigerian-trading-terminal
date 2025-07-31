// Real-time data service for Nigerian stock market simulation

class RealTimeDataService {
  constructor() {
    this.socket = null;
    this.subscribers = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    
    // Nigerian stock symbols with July 2025 market prices - NO DUPLICATES
    this.stocks = {
      // Telecoms
      'MTNN': { name: 'MTN Nigeria', basePrice: 580.00, sector: 'Telecoms' },
      'AIRTEL': { name: 'Airtel Africa', basePrice: 1250.00, sector: 'Telecoms' },
      'GLOBACOM': { name: 'Globacom', basePrice: 45.20, sector: 'Telecoms' },
      
      // Banking & Financial Services
      'ZENITH': { name: 'Zenith Bank', basePrice: 48.50, sector: 'Banking' },
      'GTCO': { name: 'GTCO', basePrice: 42.75, sector: 'Banking' },
      'ACCESS': { name: 'Access Bank', basePrice: 26.90, sector: 'Banking' },
      'UBA': { name: 'UBA', basePrice: 21.20, sector: 'Banking' },
      'FBNH': { name: 'First Bank', basePrice: 18.80, sector: 'Banking' },
      'STANBIC': { name: 'Stanbic IBTC', basePrice: 58.60, sector: 'Banking' },
      'FCMB': { name: 'FCMB', basePrice: 15.50, sector: 'Banking' },
      'WEMA': { name: 'Wema Bank', basePrice: 5.20, sector: 'Banking' },
      'UNION': { name: 'Union Bank', basePrice: 8.90, sector: 'Banking' },
      'KEYSTONE': { name: 'Keystone Bank', basePrice: 1.85, sector: 'Banking' },
      'POLARIS': { name: 'Polaris Bank', basePrice: 1.65, sector: 'Banking' },
      'PROVIDUS': { name: 'Providus Bank', basePrice: 12.40, sector: 'Banking' },
      'JAIZ': { name: 'Jaiz Bank', basePrice: 1.20, sector: 'Banking' },
      'STERLING': { name: 'Sterling Bank', basePrice: 3.80, sector: 'Banking' },
      
      // Construction & Building Materials
      'DANGCEM': { name: 'Dangote Cement', basePrice: 720.00, sector: 'Construction' },
      'BUA': { name: 'BUA Cement', basePrice: 85.60, sector: 'Construction' },
      'WAPCO': { name: 'Lafarge Africa', basePrice: 32.40, sector: 'Construction' },
      'BETAGLAS': { name: 'Beta Glass', basePrice: 68.90, sector: 'Construction' },
      'CUTIX': { name: 'Cutix Plc', basePrice: 4.20, sector: 'Construction' },
      'DUNLOP': { name: 'Dunlop Nigeria', basePrice: 6.80, sector: 'Construction' },
      
      // Consumer Goods
      'NESTLE': { name: 'Nestle Nigeria', basePrice: 1650.00, sector: 'Consumer Goods' },
      'GUINNESS': { name: 'Guinness Nigeria', basePrice: 108.40, sector: 'Consumer Goods' },
      'NB': { name: 'Nigerian Breweries', basePrice: 85.30, sector: 'Consumer Goods' },
      'DANGSUGAR': { name: 'Dangote Sugar', basePrice: 22.70, sector: 'Consumer Goods' },
      'NASCON': { name: 'Nascon Allied', basePrice: 15.40, sector: 'Consumer Goods' },
      'UNILEVER': { name: 'Unilever Nigeria', basePrice: 18.80, sector: 'Consumer Goods' },
      'FLOUR': { name: 'Flour Mills', basePrice: 52.10, sector: 'Consumer Goods' },
      'CADBURY': { name: 'Cadbury Nigeria', basePrice: 12.60, sector: 'Consumer Goods' },
      'PZ': { name: 'PZ Cussons', basePrice: 8.90, sector: 'Consumer Goods' },
      'VITAFOAM': { name: 'Vitafoam Nigeria', basePrice: 22.40, sector: 'Consumer Goods' },
      'CHAMPION': { name: 'Champion Breweries', basePrice: 3.20, sector: 'Consumer Goods' },
      'INTERNATIONAL': { name: 'International Breweries', basePrice: 5.80, sector: 'Consumer Goods' },
      
      // Oil & Gas
      'SEPLAT': { name: 'Seplat Energy', basePrice: 1450.00, sector: 'Oil & Gas' },
      'TOTAL': { name: 'Total Nigeria', basePrice: 355.50, sector: 'Oil & Gas' },
      'OANDO': { name: 'Oando', basePrice: 14.90, sector: 'Oil & Gas' },
      'CONOIL': { name: 'Conoil', basePrice: 38.20, sector: 'Oil & Gas' },
      'MRS': { name: 'MRS Oil', basePrice: 25.80, sector: 'Oil & Gas' },
      'FORTE': { name: 'Forte Oil', basePrice: 18.60, sector: 'Oil & Gas' },
      'EXXON': { name: 'Exxon Mobil', basePrice: 185.40, sector: 'Oil & Gas' },
      'CHEVRON': { name: 'Chevron Nigeria', basePrice: 165.20, sector: 'Oil & Gas' },
      
      // Healthcare & Pharmaceuticals
      'FIDSON': { name: 'Fidson Healthcare', basePrice: 15.80, sector: 'Healthcare' },
      'MAYBAKER': { name: 'May & Baker', basePrice: 7.40, sector: 'Healthcare' },
      'NEIMETH': { name: 'Neimeth Pharma', basePrice: 2.10, sector: 'Healthcare' },
      'PHARMDEKO': { name: 'Pharmdeko', basePrice: 1.85, sector: 'Healthcare' },
      'GLAXOSMITH': { name: 'GlaxoSmithKline', basePrice: 12.50, sector: 'Healthcare' },
      'EVANS': { name: 'Evans Medical', basePrice: 3.60, sector: 'Healthcare' },
      
      // Agriculture
      'OKOMUOIL': { name: 'Okomu Oil', basePrice: 245.40, sector: 'Agriculture' },
      'PRESCO': { name: 'Presco Plc', basePrice: 165.20, sector: 'Agriculture' },
      'FTNCOCOA': { name: 'FTN Cocoa', basePrice: 1.85, sector: 'Agriculture' },
      'ELLAHLAKES': { name: 'Ellah Lakes', basePrice: 4.40, sector: 'Agriculture' },
      'LIVESTOCK': { name: 'Livestock Feeds', basePrice: 2.20, sector: 'Agriculture' },
      'TANTALIZER': { name: 'Tantalizer', basePrice: 0.85, sector: 'Agriculture' },
      
      // Technology
      'CHAMS': { name: 'Chams Plc', basePrice: 0.45, sector: 'Technology' },
      'COURTVILLE': { name: 'Courtville', basePrice: 0.38, sector: 'Technology' },
      'E-TRANZACT': { name: 'E-Tranzact', basePrice: 4.20, sector: 'Technology' },
      'INTENEGINS': { name: 'Intenergins', basePrice: 0.55, sector: 'Technology' },
      'NCR': { name: 'NCR Nigeria', basePrice: 3.80, sector: 'Technology' },
      'OMATEK': { name: 'Omatek Ventures', basePrice: 0.25, sector: 'Technology' },
      
      // Real Estate
      'UPDC': { name: 'UPDC', basePrice: 1.85, sector: 'Real Estate' },
      'UACPROP': { name: 'UAC Property', basePrice: 1.45, sector: 'Real Estate' },
      
      // Conglomerates
      'UACN': { name: 'UAC Nigeria', basePrice: 15.80, sector: 'Conglomerate' },
      'TRANSCORP': { name: 'Transcorp', basePrice: 2.40, sector: 'Conglomerate' },
      'JOHNHOLT': { name: 'John Holt', basePrice: 1.20, sector: 'Conglomerate' },
      'SCOA': { name: 'SCOA Nigeria', basePrice: 0.85, sector: 'Conglomerate' },
      
      // Industrial Goods
      'BERGER': { name: 'Berger Paints', basePrice: 18.30, sector: 'Industrial Goods' },
      'CAP': { name: 'CAP Plc', basePrice: 26.90, sector: 'Industrial Goods' },
      'PAINTCOM': { name: 'Paintcom', basePrice: 12.40, sector: 'Industrial Goods' },
      'VONO': { name: 'Vono Products', basePrice: 3.60, sector: 'Industrial Goods' },
      'TRIPLEG': { name: 'TripleG', basePrice: 1.85, sector: 'Industrial Goods' },
      
      // Insurance
      'AIICO': { name: 'AIICO Insurance', basePrice: 0.95, sector: 'Insurance' },
      'CORNERSTONE': { name: 'Cornerstone Insurance', basePrice: 0.65, sector: 'Insurance' },
      'LASACO': { name: 'Lasaco Assurance', basePrice: 1.20, sector: 'Insurance' },
      'NEM': { name: 'NEM Insurance', basePrice: 4.80, sector: 'Insurance' },
      'PRESTIGE': { name: 'Prestige Assurance', basePrice: 0.55, sector: 'Insurance' },
      'ROYALEX': { name: 'Royal Exchange', basePrice: 0.45, sector: 'Insurance' },
      'WAPIC': { name: 'Wapic Insurance', basePrice: 0.35, sector: 'Insurance' },
      'MANSARD': { name: 'Mansard Insurance', basePrice: 2.10, sector: 'Insurance' },
      'LINKASSURE': { name: 'Linkage Assurance', basePrice: 0.75, sector: 'Insurance' },
      'CONSOLIDATED': { name: 'Consolidated Hallmark', basePrice: 0.85, sector: 'Insurance' },
      
      // Transportation & Logistics
      'REDSTAREX': { name: 'Red Star Express', basePrice: 3.20, sector: 'Transportation' },
      'ABC': { name: 'ABC Transport', basePrice: 0.85, sector: 'Transportation' }
    };
    
    this.currentPrices = {};
    this.initializePrices();
  }

  initializePrices() {
    Object.keys(this.stocks).forEach(symbol => {
      const stock = this.stocks[symbol];
      this.currentPrices[symbol] = {
        symbol,
        name: stock.name,
        sector: stock.sector,
        price: stock.basePrice,
        change: 0,
        changePercent: 0,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        high: stock.basePrice + Math.random() * 10,
        low: stock.basePrice - Math.random() * 5,
        open: stock.basePrice,
        lastUpdate: new Date()
      };
    });
  }

  connect() {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.startRealTimeUpdates();
    this.emit('connected', { status: 'connected', timestamp: new Date() });
  }

  disconnect() {
    this.isConnected = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.emit('disconnected', { status: 'disconnected', timestamp: new Date() });
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      this.emit('connectionFailed', { 
        status: 'failed', 
        attempts: this.reconnectAttempts,
        timestamp: new Date() 
      });
    }
  }

  startRealTimeUpdates() {
    // Simulate real-time price updates
    this.updateInterval = setInterval(() => {
      if (this.isConnected) {
        const symbols = Object.keys(this.stocks);
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.updateStockPrice(randomSymbol);
        this.updateVolume(randomSymbol);
        this.emit('marketData', this.getMarketData());
      }
    }, 5000);

    // Generate news and alerts periodically
    setInterval(() => {
      if (this.isConnected) {
        this.emit('news', this.generateNews());
        this.emit('alert', this.generateAlerts());
      }
    }, 10000);
  }

  updateStockPrice(symbol) {
    if (this.currentPrices[symbol]) {
      const stock = this.stocks[symbol];
      const change = (Math.random() - 0.5) * 2; // -1 to +1
      const newPrice = Math.max(0.01, stock.basePrice + change);
      const changePercent = ((newPrice - stock.basePrice) / stock.basePrice) * 100;
      
      this.currentPrices[symbol].price = newPrice;
      this.currentPrices[symbol].change = newPrice - stock.basePrice;
      this.currentPrices[symbol].changePercent = changePercent;
      this.currentPrices[symbol].lastUpdate = new Date();
      
      this.emit('priceUpdate', {
        symbol,
        price: newPrice,
        change: this.currentPrices[symbol].change,
        changePercent: changePercent,
        timestamp: new Date()
      });
    }
  }

  updateVolume(symbol) {
    if (this.currentPrices[symbol]) {
      const volumeChange = Math.floor(Math.random() * 100000);
      this.currentPrices[symbol].volume += volumeChange;
      
      this.emit('volumeUpdate', {
        symbol,
        volume: this.currentPrices[symbol].volume,
        timestamp: new Date()
      });
    }
  }

  on(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
  }

  off(event, callback) {
    if (this.subscribers.has(event)) {
      const callbacks = this.subscribers.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }

  getMarketData() {
    return Object.values(this.currentPrices).sort((a, b) => b.volume - a.volume);
  }

  getStockData(symbol) {
    return this.currentPrices[symbol] || null;
  }

  getWatchlist() {
    // Return top 8 stocks by volume
    return Object.values(this.currentPrices)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 8);
  }

  generateNews() {
    const companies = Object.values(this.stocks);
    const company = companies[Math.floor(Math.random() * companies.length)];
    const newsTypes = [
      'earnings report',
      'market analysis',
      'regulatory update',
      'strategic partnership',
      'expansion plans',
      'dividend announcement'
    ];
    const newsType = newsTypes[Math.floor(Math.random() * newsTypes.length)];
    
    return {
      id: Date.now(),
      title: `${company.name} - ${newsType}`,
      content: `Latest ${newsType} for ${company.name} shows positive market sentiment.`,
      timestamp: new Date(),
      sentiment: Math.random() > 0.5 ? 'positive' : 'neutral'
    };
  }

  generateAlerts() {
    const symbols = Object.keys(this.stocks);
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const alertTypes = [
      'price alert',
      'volume spike',
      'technical indicator',
      'market movement'
    ];
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    return {
      id: Date.now(),
      symbol,
      type: alertType,
      message: `${symbol} - ${alertType} detected`,
      timestamp: new Date(),
      priority: Math.random() > 0.7 ? 'high' : 'medium'
    };
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      lastUpdate: new Date()
    };
  }
}

// Export singleton instance
export const realTimeDataService = new RealTimeDataService(); 