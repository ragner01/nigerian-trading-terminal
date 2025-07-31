class NewsService {
  constructor() {
    this.newsItems = [];
    this.alerts = [];
    this.subscribers = new Map();
    this.newsInterval = null;
    this.alertInterval = null;
  }

  // Market news templates
  newsTemplates = [
    {
      title: "Nigerian Stock Exchange Records Strong Gains",
      excerpt: "The NSE All-Share Index rose by {percent}% today, led by {sector} stocks. {company} gained {gain}% to close at ₦{price}.",
      source: "Bloomberg",
      sentiment: "positive"
    },
    {
      title: "Central Bank Announces New Monetary Policy",
      excerpt: "The CBN has introduced measures to stabilize the naira, affecting {sector} stocks. Market analysts expect {impact}.",
      source: "Reuters",
      sentiment: "neutral"
    },
    {
      title: "Oil Prices Decline Amid Global Concerns",
      excerpt: "Global oil prices fell {percent}% as economic growth concerns weigh on energy stocks. {company} declined {loss}%.",
      source: "CNBC",
      sentiment: "negative"
    },
    {
      title: "Banking Sector Shows Resilience",
      excerpt: "Nigerian banks demonstrate strong performance with {company} leading gains at {gain}%. Sector outlook remains positive.",
      source: "Financial Times",
      sentiment: "positive"
    },
    {
      title: "Tech Stocks Rally on Innovation News",
      excerpt: "Technology sector sees renewed interest as {company} announces new digital initiatives. Stock up {gain}%.",
      source: "TechCrunch",
      sentiment: "positive"
    },
    {
      title: "Consumer Goods Sector Faces Challenges",
      excerpt: "Rising input costs impact consumer goods companies. {company} reports {loss}% decline in quarterly earnings.",
      source: "BusinessDay",
      sentiment: "negative"
    },
    {
      title: "Agriculture Stocks Benefit from Policy Changes",
      excerpt: "Government agricultural policies boost {company} shares by {gain}%. Sector expected to grow {percent}% this year.",
      source: "Guardian",
      sentiment: "positive"
    },
    {
      title: "Healthcare Sector Innovation Drive",
      excerpt: "{company} announces breakthrough in pharmaceutical research, stock surges {gain}%. Healthcare index up {percent}%.",
      source: "Medical News",
      sentiment: "positive"
    }
  ];

  // Alert templates
  alertTemplates = [
    {
      type: "info",
      title: "Price Alert: {symbol}",
      message: "{symbol} has {action} {percent}% today. Current price: ₦{price}",
      priority: "medium"
    },
    {
      type: "warning",
      title: "Volume Spike: {symbol}",
      message: "Unusual trading volume detected for {symbol}. Volume increased by {percent}%",
      priority: "high"
    },
    {
      type: "success",
      title: "Target Reached: {symbol}",
      message: "{symbol} has reached your target price of ₦{price}. Consider taking profits.",
      priority: "medium"
    },
    {
      type: "error",
      title: "Stop Loss Triggered: {symbol}",
      message: "{symbol} has hit your stop loss at ₦{price}. Position automatically closed.",
      priority: "high"
    }
  ];

  // Nigerian companies for news generation
  companies = {
    'MTNN': { name: 'MTN Nigeria', sector: 'Telecoms' },
    'DANGCEM': { name: 'Dangote Cement', sector: 'Construction' },
    'ZENITH': { name: 'Zenith Bank', sector: 'Banking' },
    'GTCO': { name: 'GTCO', sector: 'Banking' },
    'ACCESS': { name: 'Access Bank', sector: 'Banking' },
    'UBA': { name: 'UBA', sector: 'Banking' },
    'FBNH': { name: 'First Bank', sector: 'Banking' },
    'STANBIC': { name: 'Stanbic IBTC', sector: 'Banking' },
    'NESTLE': { name: 'Nestle Nigeria', sector: 'Consumer Goods' },
    'GUINNESS': { name: 'Guinness Nigeria', sector: 'Consumer Goods' },
    'SEPLAT': { name: 'Seplat Energy', sector: 'Oil & Gas' },
    'TOTAL': { name: 'Total Nigeria', sector: 'Oil & Gas' },
    'FIDSON': { name: 'Fidson Healthcare', sector: 'Healthcare' },
    'OKOMUOIL': { name: 'Okomu Oil', sector: 'Agriculture' }
  };

  sectors = ['Banking', 'Telecoms', 'Construction', 'Consumer Goods', 'Oil & Gas', 'Healthcare', 'Agriculture', 'Technology'];

  start() {
    // Generate news every 30 seconds
    this.newsInterval = setInterval(() => {
      this.generateNews();
    }, 30000);

    // Generate alerts every 45 seconds
    this.alertInterval = setInterval(() => {
      this.generateAlerts();
    }, 45000);

    // Generate initial news
    this.generateNews();
    this.generateAlerts();
  }

  stop() {
    if (this.newsInterval) {
      clearInterval(this.newsInterval);
    }
    if (this.alertInterval) {
      clearInterval(this.alertInterval);
    }
  }

  generateNews() {
    const template = this.newsTemplates[Math.floor(Math.random() * this.newsTemplates.length)];
    const company = this.getRandomCompany();
    const percent = (Math.random() * 5 + 1).toFixed(1);
    const gain = (Math.random() * 8 + 2).toFixed(1);
    const loss = (Math.random() * 6 + 1).toFixed(1);
    const price = (Math.random() * 1000 + 50).toFixed(2);
    const impact = ['positive market reaction', 'mixed market response', 'cautious investor sentiment'][Math.floor(Math.random() * 3)];

    const newsItem = {
      id: Date.now() + Math.random(),
      title: template.title.replace('{company}', company.name),
      excerpt: template.excerpt
        .replace('{percent}', percent)
        .replace('{sector}', company.sector)
        .replace('{company}', company.name)
        .replace('{gain}', gain)
        .replace('{loss}', loss)
        .replace('{price}', price)
        .replace('{impact}', impact),
      source: template.source,
      time: this.getTimeAgo(),
      sentiment: template.sentiment
    };

    this.newsItems.unshift(newsItem);
    
    // Keep only last 20 news items
    if (this.newsItems.length > 20) {
      this.newsItems = this.newsItems.slice(0, 20);
    }

    this.emit('news', newsItem);
  }

  generateAlerts() {
    const template = this.alertTemplates[Math.floor(Math.random() * this.alertTemplates.length)];
    const company = this.getRandomCompany();
    const percent = (Math.random() * 10 + 2).toFixed(1);
    const price = (Math.random() * 500 + 50).toFixed(2);
    const action = Math.random() > 0.5 ? 'gained' : 'lost';

    const alert = {
      id: Date.now() + Math.random(),
      type: template.type,
      title: template.title.replace('{symbol}', company.symbol),
      message: template.message
        .replace('{symbol}', company.symbol)
        .replace('{action}', action)
        .replace('{percent}', percent)
        .replace('{price}', price),
      time: this.getTimeAgo(),
      priority: template.priority,
      symbol: company.symbol,
      price: parseFloat(price)
    };

    this.alerts.unshift(alert);
    
    // Keep only last 15 alerts
    if (this.alerts.length > 15) {
      this.alerts = this.alerts.slice(0, 15);
    }

    this.emit('alert', alert);
  }

  getRandomCompany() {
    const symbols = Object.keys(this.companies);
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    return { symbol, ...this.companies[symbol] };
  }

  getTimeAgo() {
    const times = ['Just now', '2 minutes ago', '5 minutes ago', '10 minutes ago', '15 minutes ago'];
    return times[Math.floor(Math.random() * times.length)];
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

  // Get current news and alerts
  getNews() {
    return this.newsItems;
  }

  getAlerts() {
    return this.alerts;
  }
}

// Create singleton instance
const newsService = new NewsService();

export default newsService; 