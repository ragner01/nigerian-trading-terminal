// Real-time data service for Nigerian stock market simulation

class RealTimeDataService {
  constructor() {
    this.socket = null;
    this.subscribers = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    
    // Nigerian stock symbols with July 2025 market prices
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
      'SKYE': { name: 'Skye Bank', basePrice: 2.10, sector: 'Banking' },
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
      'BAGCO': { name: 'Berger Paints', basePrice: 18.30, sector: 'Construction' },
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
      'SKYEBANK': { name: 'Skye Bank', basePrice: 0.95, sector: 'Real Estate' },
      
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
      'CUSTODIAN': { name: 'Custodian Insurance', basePrice: 8.40, sector: 'Insurance' },
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
      'ABC': { name: 'ABC Transport', basePrice: 0.85, sector: 'Transportation' },
      'CHIPLC': { name: 'Custodian Investment', basePrice: 8.40, sector: 'Investment' },
      'COURTVILLE': { name: 'Courtville', basePrice: 0.38, sector: 'Technology' },
      'INTENEGINS': { name: 'Intenergins', basePrice: 0.55, sector: 'Technology' },
      'NCR': { name: 'NCR Nigeria', basePrice: 3.80, sector: 'Technology' },
      'OMATEK': { name: 'Omatek Ventures', basePrice: 0.25, sector: 'Technology' },
      
      // Additional Consumer Goods
      'DANGSUGAR': { name: 'Dangote Sugar', basePrice: 22.70, sector: 'Consumer Goods' },
      'NASCON': { name: 'Nascon Allied', basePrice: 15.40, sector: 'Consumer Goods' },
      'UNILEVER': { name: 'Unilever Nigeria', basePrice: 18.80, sector: 'Consumer Goods' },
      'FLOUR': { name: 'Flour Mills', basePrice: 52.10, sector: 'Consumer Goods' },
      'CADBURY': { name: 'Cadbury Nigeria', basePrice: 12.60, sector: 'Consumer Goods' },
      'PZ': { name: 'PZ Cussons', basePrice: 8.90, sector: 'Consumer Goods' },
      'VITAFOAM': { name: 'Vitafoam Nigeria', basePrice: 22.40, sector: 'Consumer Goods' },
      'CHAMPION': { name: 'Champion Breweries', basePrice: 3.20, sector: 'Consumer Goods' },
      'INTERNATIONAL': { name: 'International Breweries', basePrice: 5.80, sector: 'Consumer Goods' },
      
      // Additional Oil & Gas
      'CONOIL': { name: 'Conoil', basePrice: 38.20, sector: 'Oil & Gas' },
      'MRS': { name: 'MRS Oil', basePrice: 25.80, sector: 'Oil & Gas' },
      'FORTE': { name: 'Forte Oil', basePrice: 18.60, sector: 'Oil & Gas' },
      'EXXON': { name: 'Exxon Mobil', basePrice: 185.40, sector: 'Oil & Gas' },
      'CHEVRON': { name: 'Chevron Nigeria', basePrice: 165.20, sector: 'Oil & Gas' },
      
      // Additional Healthcare
      'MAYBAKER': { name: 'May & Baker', basePrice: 7.40, sector: 'Healthcare' },
      'NEIMETH': { name: 'Neimeth Pharma', basePrice: 2.10, sector: 'Healthcare' },
      'PHARMDEKO': { name: 'Pharmdeko', basePrice: 1.85, sector: 'Healthcare' },
      'GLAXOSMITH': { name: 'GlaxoSmithKline', basePrice: 12.50, sector: 'Healthcare' },
      'EVANS': { name: 'Evans Medical', basePrice: 3.60, sector: 'Healthcare' },
      
      // Additional Agriculture
      'PRESCO': { name: 'Presco Plc', basePrice: 165.20, sector: 'Agriculture' },
      'FTNCOCOA': { name: 'FTN Cocoa', basePrice: 1.85, sector: 'Agriculture' },
      'ELLAHLAKES': { name: 'Ellah Lakes', basePrice: 4.40, sector: 'Agriculture' },
      'LIVESTOCK': { name: 'Livestock Feeds', basePrice: 2.20, sector: 'Agriculture' },
      'TANTALIZER': { name: 'Tantalizer', basePrice: 0.85, sector: 'Agriculture' },
      
      // Additional Construction
      'BUA': { name: 'BUA Cement', basePrice: 85.60, sector: 'Construction' },
      'WAPCO': { name: 'Lafarge Africa', basePrice: 32.40, sector: 'Construction' },
      'BETAGLAS': { name: 'Beta Glass', basePrice: 68.90, sector: 'Construction' },
      'BAGCO': { name: 'Berger Paints', basePrice: 18.30, sector: 'Construction' },
      'CUTIX': { name: 'Cutix Plc', basePrice: 4.20, sector: 'Construction' },
      'DUNLOP': { name: 'Dunlop Nigeria', basePrice: 6.80, sector: 'Construction' },
      
      // Additional Banking
      'UNION': { name: 'Union Bank', basePrice: 8.90, sector: 'Banking' },
      'SKYE': { name: 'Skye Bank', basePrice: 2.10, sector: 'Banking' },
      'KEYSTONE': { name: 'Keystone Bank', basePrice: 1.85, sector: 'Banking' },
      'POLARIS': { name: 'Polaris Bank', basePrice: 1.65, sector: 'Banking' },
      'PROVIDUS': { name: 'Providus Bank', basePrice: 12.40, sector: 'Banking' },
      'JAIZ': { name: 'Jaiz Bank', basePrice: 1.20, sector: 'Banking' },
      'STERLING': { name: 'Sterling Bank', basePrice: 3.80, sector: 'Banking' },
      
      // Additional Industrial Goods
      'PAINTCOM': { name: 'Paintcom', basePrice: 12.40, sector: 'Industrial Goods' },
      'VONO': { name: 'Vono Products', basePrice: 3.60, sector: 'Industrial Goods' },
      'TRIPLEG': { name: 'TripleG', basePrice: 1.85, sector: 'Industrial Goods' },
      
      // Additional Conglomerates
      'TRANSCORP': { name: 'Transcorp', basePrice: 2.40, sector: 'Conglomerate' },
      'JOHNHOLT': { name: 'John Holt', basePrice: 1.20, sector: 'Conglomerate' },
      'SCOA': { name: 'SCOA Nigeria', basePrice: 0.85, sector: 'Conglomerate' },
      
      // Additional Real Estate
      'UPDC': { name: 'UPDC', basePrice: 1.85, sector: 'Real Estate' },
      'UACPROP': { name: 'UAC Property', basePrice: 1.45, sector: 'Real Estate' },
      'SKYEBANK': { name: 'Skye Bank', basePrice: 0.95, sector: 'Real Estate' }
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
    try {
      // Simulate WebSocket connection
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('🟢 Real-time data service connected');
      
      // Start real-time updates
      this.startRealTimeUpdates();
      
      // Emit connection event
      this.emit('connected', { timestamp: new Date() });
      
    } catch (error) {
      console.error('❌ Failed to connect to real-time data service:', error);
      this.handleReconnect();
    }
  }

  disconnect() {
    this.isConnected = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    console.log('🔴 Real-time data service disconnected');
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  startRealTimeUpdates() {
    // Update prices every 2 seconds
    this.updateInterval = setInterval(() => {
      if (!this.isConnected) return;
      
      Object.keys(this.currentPrices).forEach(symbol => {
        this.updateStockPrice(symbol);
      });
      
      // Emit market data update
      this.emit('marketData', {
        timestamp: new Date(),
        data: Object.values(this.currentPrices)
      });
      
    }, 2000);

    // Update volume every 5 seconds
    this.volumeInterval = setInterval(() => {
      if (!this.isConnected) return;
      
      Object.keys(this.currentPrices).forEach(symbol => {
        this.updateVolume(symbol);
      });
      
    }, 5000);
  }

  updateStockPrice(symbol) {
    const stock = this.currentPrices[symbol];
    if (!stock) return;

    // Generate realistic price movement
    const volatility = 0.02; // 2% volatility
    const randomChange = (Math.random() - 0.5) * volatility;
    const newPrice = stock.price * (1 + randomChange);
    
    // Update price data
    const oldPrice = stock.price;
    stock.price = parseFloat(newPrice.toFixed(2));
    stock.change = parseFloat((stock.price - oldPrice).toFixed(2));
    stock.changePercent = parseFloat(((stock.change / oldPrice) * 100).toFixed(2));
    stock.high = Math.max(stock.high, stock.price);
    stock.low = Math.min(stock.low, stock.price);
    stock.lastUpdate = new Date();

    // Emit price update
    this.emit('priceUpdate', {
      symbol,
      data: stock,
      timestamp: new Date()
    });
  }

  updateVolume(symbol) {
    const stock = this.currentPrices[symbol];
    if (!stock) return;

    // Generate realistic volume changes
    const volumeChange = Math.floor(Math.random() * 50000) - 25000;
    stock.volume = Math.max(100000, stock.volume + volumeChange);

    // Emit volume update
    this.emit('volumeUpdate', {
      symbol,
      volume: stock.volume,
      timestamp: new Date()
    });
  }

  // Event handling
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

  // Market data methods
  getMarketData() {
    return Object.values(this.currentPrices);
  }

  getStockData(symbol) {
    return this.currentPrices[symbol];
  }

  getWatchlist() {
    // Return top 8 stocks by volume
    const sortedStocks = Object.values(this.currentPrices)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 8);
    
    return sortedStocks.map(stock => stock.symbol);
  }

  // News and alerts simulation
  generateNews() {
    const newsItems = [
      {
        id: Date.now(),
        title: "Nigerian Stock Exchange Records Strong Gains",
        excerpt: "The NSE All-Share Index rose by 1.2% today, led by banking stocks...",
        source: "Bloomberg",
        time: "2 minutes ago",
        sentiment: "positive"
      },
      {
        id: Date.now() + 1,
        title: "Central Bank Announces New Monetary Policy",
        excerpt: "The CBN has introduced measures to stabilize the naira...",
        source: "Reuters",
        time: "15 minutes ago",
        sentiment: "neutral"
      },
      {
        id: Date.now() + 2,
        title: "Oil Prices Decline Amid Global Concerns",
        excerpt: "Global oil prices fell 2.5% as economic growth concerns weigh...",
        source: "CNBC",
        time: "1 hour ago",
        sentiment: "negative"
      }
    ];

    return newsItems;
  }

  generateAlerts() {
    const alerts = [];
    
    // Generate price alerts
    Object.values(this.currentPrices).forEach(stock => {
      if (Math.abs(stock.changePercent) > 3) {
        alerts.push({
          id: Date.now() + Math.random(),
          type: stock.changePercent > 0 ? 'info' : 'warning',
          title: `Price Alert: ${stock.symbol}`,
          message: `${stock.symbol} has ${stock.changePercent > 0 ? 'gained' : 'lost'} ${Math.abs(stock.changePercent).toFixed(2)}% today. Current price: ₦${stock.price.toFixed(2)}`,
          time: 'Just now',
          symbol: stock.symbol,
          price: stock.price
        });
      }
    });

    return alerts;
  }

  // Connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      lastUpdate: new Date()
    };
  }
}

// Create singleton instance
const realTimeDataService = new RealTimeDataService();

export default realTimeDataService; 