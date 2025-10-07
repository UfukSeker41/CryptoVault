// Kar/zarar hesapla
export const calculateProfit = (buyPrice, currentPrice, amount) => {
  const totalBuyPrice = buyPrice * amount;
  const currentValue = currentPrice * amount;
  const profit = currentValue - totalBuyPrice;
  const profitPercentage = ((profit / totalBuyPrice) * 100);
  
  return {
    profit: profit,
    profitPercentage: profitPercentage,
    currentValue: currentValue,
    totalBuyPrice: totalBuyPrice
  };
};

// Portfolio toplam değeri hesapla
export const calculatePortfolioValue = (portfolio, currentPrices) => {
  let totalValue = 0;
  let totalInvested = 0;

  portfolio.forEach(transaction => {
    const currentPrice = currentPrices[transaction.coinId];
    if (currentPrice) {
      totalValue += currentPrice * transaction.amount;
      totalInvested += transaction.buyPrice * transaction.amount;
    }
  });

  const profit = totalValue - totalInvested;
  const profitPercentage = totalInvested > 0 ? ((profit / totalInvested) * 100) : 0;

  return {
    totalValue,
    totalInvested,
    profit,
    profitPercentage
  };
};

// Coin bazında holdings hesapla
export const calculateHoldings = (portfolio, currentPrices) => {
  const holdings = {};

  portfolio.forEach(transaction => {
    const coinId = transaction.coinId;
    
    if (!holdings[coinId]) {
      holdings[coinId] = {
        coinId: coinId,
        coinName: transaction.coinName,
        coinSymbol: transaction.coinSymbol,
        totalAmount: 0,
        totalInvested: 0,
        transactions: []
      };
    }

    holdings[coinId].totalAmount += transaction.amount;
    holdings[coinId].totalInvested += (transaction.buyPrice * transaction.amount);
    holdings[coinId].transactions.push(transaction);
  });

  // Her holding için profit hesapla
  Object.keys(holdings).forEach(coinId => {
    const holding = holdings[coinId];
    const currentPrice = currentPrices[coinId];
    
    if (currentPrice) {
      const avgBuyPrice = holding.totalInvested / holding.totalAmount;
      const profitData = calculateProfit(avgBuyPrice, currentPrice, holding.totalAmount);
      
      holdings[coinId] = {
        ...holding,
        currentPrice: currentPrice,
        avgBuyPrice: avgBuyPrice,
        ...profitData
      };
    }
  });

  return Object.values(holdings);
};

// Portfolio allocation hesapla (pie chart için)
export const calculateAllocation = (holdings) => {
  const total = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  
  return holdings.map(holding => ({
    coinId: holding.coinId,
    coinName: holding.coinName,
    coinSymbol: holding.coinSymbol,
    value: holding.currentValue,
    percentage: ((holding.currentValue / total) * 100).toFixed(2)
  }));
};
