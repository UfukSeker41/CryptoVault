// Favorileri kaydet
export const saveFavorites = (favorites) => {
  localStorage.setItem('cryptoFavorites', JSON.stringify(favorites));
};

// Favorileri getir
export const getFavorites = () => {
  const favorites = localStorage.getItem('cryptoFavorites');
  return favorites ? JSON.parse(favorites) : [];
};

// Favorilere ekle
export const addToFavorites = (coinId) => {
  const favorites = getFavorites();
  if (!favorites.includes(coinId)) {
    favorites.push(coinId);
    saveFavorites(favorites);
  }
  return favorites;
};

// Favorilerden çıkar
export const removeFromFavorites = (coinId) => {
  const favorites = getFavorites();
  const updated = favorites.filter(id => id !== coinId);
  saveFavorites(updated);
  return updated;
};

// Favori mi kontrol et
export const isFavorite = (coinId) => {
  const favorites = getFavorites();
  return favorites.includes(coinId);
};

// Portfolio kaydet
export const savePortfolio = (portfolio) => {
  localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
};

// Portfolio getir
export const getPortfolio = () => {
  const portfolio = localStorage.getItem('cryptoPortfolio');
  return portfolio ? JSON.parse(portfolio) : [];
};

// Portfolio'ya transaction ekle
export const addTransaction = (transaction) => {
  const portfolio = getPortfolio();
  portfolio.push({
    ...transaction,
    id: Date.now()
  });
  savePortfolio(portfolio);
  return portfolio;
};

// Transaction sil
export const removeTransaction = (transactionId) => {
  const portfolio = getPortfolio();
  const updated = portfolio.filter(t => t.id !== transactionId);
  savePortfolio(updated);
  return updated;
};

// Transaction güncelle
export const updateTransaction = (transactionId, updatedData) => {
  const portfolio = getPortfolio();
  const updated = portfolio.map(t => 
    t.id === transactionId ? { ...t, ...updatedData } : t
  );
  savePortfolio(updated);
  return updated;
};

// Theme kaydet
export const saveTheme = (theme) => {
  localStorage.setItem('cryptoTheme', theme);
};

// Theme getir
export const getTheme = () => {
  return localStorage.getItem('cryptoTheme') || 'dark';
};

// Currency kaydet
export const saveCurrency = (currency) => {
  localStorage.setItem('cryptoCurrency', currency);
};

// Currency getir
export const getCurrency = () => {
  return localStorage.getItem('cryptoCurrency') || 'usd';
};
