import axios from 'axios';

// CoinGecko API - Free tier
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Axios instance oluştur
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 10000 // 10 saniye timeout
});

// Rate limiting için queue sistemi
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 saniye arası minimum bekleme

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
};

// Simple cache to reduce API calls
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika (rate limit için daha uzun cache)

const getCached = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📦 Cache'den alındı: ${key}`);
    return cached.data;
  }
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Retry mekanizması ile API çağrısı
const apiCall = async (callFn, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      await waitForRateLimit();
      return await callFn();
    } catch (error) {
      if (error.response?.status === 429 && i < retries) {
        const waitTime = (i + 1) * 5000; // 5, 10 saniye bekle
        console.log(`⏳ Rate limit - ${waitTime/1000} saniye bekleniyor...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
};

// Top 100 coin listesi
export const getCoins = async (currency = 'usd', page = 1) => {
  const cacheKey = `coins_${currency}_${page}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const data = await apiCall(async () => {
      const response = await axiosInstance.get('/coins/markets', {
        params: {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: 100,
          page: page,
          sparkline: true,
          price_change_percentage: '24h'
        }
      });
      return response.data;
    });
    
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching coins:', error.message);
    return [];
  }
};

// Coin detay bilgileri
export const getCoinDetail = async (id) => {
  const cacheKey = `detail_${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const data = await apiCall(async () => {
      const response = await axiosInstance.get(`/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false
        }
      });
      return response.data;
    });

    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching coin detail:', error.message);
    throw error;
  }
};

// Fiyat grafiği verisi
export const getCoinChart = async (id, days = 7, currency = 'usd') => {
  const cacheKey = `chart_${id}_${days}_${currency}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const data = await apiCall(async () => {
      const response = await axiosInstance.get(`/coins/${id}/market_chart`, {
        params: {
          vs_currency: currency,
          days: days
        }
      });
      return response.data;
    });

    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching chart data:', error.message);
    return { prices: [] };
  }
};

// Global market verileri
export const getGlobalData = async () => {
  const cacheKey = 'global_data';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const data = await apiCall(async () => {
      const response = await axiosInstance.get('/global');
      return response.data;
    });

    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching global data:', error.message);
    return { data: null };
  }
};

// Trending coins
export const getTrendingCoins = async () => {
  const cacheKey = 'trending';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const data = await apiCall(async () => {
      const response = await axiosInstance.get('/search/trending');
      return response.data;
    });

    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching trending coins:', error.message);
    return { coins: [] };
  }
};
