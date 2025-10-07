// Fiyat formatı
export const formatPrice = (price) => {
  if (!price && price !== 0) return '$0.00';
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(2)}K`;
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price.toFixed(6)}`;
  }
};

// Yüzde formatı
export const formatPercentage = (percentage) => {
  if (!percentage && percentage !== 0) return '0.00%';
  const formatted = percentage.toFixed(2);
  return percentage >= 0 ? `+${formatted}%` : `${formatted}%`;
};

// Market cap formatı
export const formatMarketCap = (marketCap) => {
  if (!marketCap && marketCap !== 0) return 'N/A';
  if (marketCap >= 1000000000000) {
    return `$${(marketCap / 1000000000000).toFixed(2)}T`;
  } else if (marketCap >= 1000000000) {
    return `$${(marketCap / 1000000000).toFixed(2)}B`;
  } else if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(2)}M`;
  }
  return `$${marketCap.toFixed(2)}`;
};

// Hacim formatı
export const formatVolume = (volume) => {
  return formatMarketCap(volume);
};

// Sayı formatı (virgüllü)
export const formatNumber = (num) => {
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

// Para birimi sembolleri
export const getCurrencySymbol = (currency) => {
  const symbols = {
    usd: '$',
    eur: '€',
    try: '₺',
    btc: '₿',
    eth: 'Ξ'
  };
  return symbols[currency.toLowerCase()] || '$';
};

// Tarih formatı
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
