const mockCryptoData = [
    {
      id: 'bitcoin',
      rank: 1,
      logo: '/assets/coin_icon/bitcoin.png',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 50000,
      priceChange1h: 0.5,
      priceChange24h: 2.3,
      priceChange7d: -1.2,
      marketCap: 950000000000,
      volume24h: 25000000000,
      circulatingSupply: 19000000,
      maxSupply: 21000000,
      sparkline: [49000, 49500, 50200, 49800, 50500, 50300, 50900],
    },
    {
      id: 'ethereum',
      rank: 2,
      logo: '/assets/coin_icon/ethereum.png',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3000,
      priceChange1h: 0.8,
      priceChange24h: 3.1,
      priceChange7d: 5.2,
      marketCap: 360000000,
      volume24h: 18000000,
      circulatingSupply: 12000000,
      maxSupply: 15000000,
      sparkline: [2900, 2950, 3020, 4080, 3050, 3030, 2000],
    },
    {
      id: 'tether',
      rank: 3,
      logo: '/assets/coin_icon/tether.png',
      name: 'Tether',
      symbol: 'USDT',
      price: 1.0,
      priceChange1h: 0.0,
      priceChange24h: 0.0,
      priceChange7d: 0.0,
      marketCap: 80000000000,
      volume24h: 50000000000,
      circulatingSupply: 80000000000,
      maxSupply: 145000000,
      sparkline: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    },
    {
      id: 'binancecoin',
      rank: 4,
      logo: '/assets/coin_icon/binance.png',
      name: 'Binance Coin',
      symbol: 'BNB',
      price: 400,
      priceChange1h: 0.3,
      priceChange24h: 1.5,
      priceChange7d: 2.8,
      marketCap: 65000000000,
      volume24h: 2000000000,
      circulatingSupply: 160000000,
      maxSupply: 170000000,
      sparkline: [390, 395, 402, 398, 405, 407, 410],
    },
    {
      id: 'solana',
      rank: 5,
      logo: '/assets/coin_icon/solana.png',
      name: 'Solana',
      symbol: 'SOL',
      price: 150,
      priceChange1h: 1.2,
      priceChange24h: 4.5,
      priceChange7d: 8.2,
      marketCap: 50000000000,
      volume24h: 3000000000,
      circulatingSupply: 330000000,
      maxSupply: 517000000,
      sparkline: [140, 145, 152, 148, 155, 153, 150],
    },
  ];
  
  export const fetchCryptoData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCryptoData);
      }, 500);
    });
  };
  
  export const simulateWebSocketUpdates = (callback) => {
    const interval = setInterval(() => {
      const randomAssetIndex = Math.floor(Math.random() * mockCryptoData.length);
      const asset = mockCryptoData[randomAssetIndex];
      
      const priceChange = (Math.random() - 0.5) * 2;
      const newPrice = asset.price * (1 + priceChange / 100);
      
      const updates = {
        price: parseFloat(newPrice.toFixed(2)),
        priceChange1h: parseFloat((asset.priceChange1h + (Math.random() - 0.5)).toFixed(2)),
        priceChange24h: parseFloat((asset.priceChange24h + (Math.random() - 0.5)).toFixed(2)),
        priceChange7d: parseFloat((asset.priceChange7d + (Math.random() - 0.5)).toFixed(2)),
        volume24h: parseFloat((asset.volume24h * (1 + (Math.random() - 0.3) / 10)).toFixed(2)),
      };
      
      callback(asset.id, updates);
    }, 2000);
  
    return () => clearInterval(interval);
  };