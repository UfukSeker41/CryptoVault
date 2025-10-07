import React, { useState, useEffect, useContext } from 'react';
import { getCoins } from '../services/api';
import { CurrencyContext } from '../context/CurrencyContext';
import SearchBar from '../components/SearchBar';
import CoinList from '../components/CoinList';
import Loader from '../components/Loader';
import { FaStar, FaChartLine } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { currency } = useContext(CurrencyContext);

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 300000); // 5 dakikada bir (300 saniye)
    return () => clearInterval(interval);
  }, [currency]);

  useEffect(() => {
    filterCoins();
  }, [coins, searchTerm, showFavoritesOnly]);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const data = await getCoins(currency);
      setCoins(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching coins:', err);
      setError('Failed to fetch coins. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterCoins = () => {
    let filtered = coins;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Favorites filter
    if (showFavoritesOnly) {
      const favorites = JSON.parse(localStorage.getItem('cryptoFavorites') || '[]');
      filtered = filtered.filter(coin => favorites.includes(coin.id));
    }

    setFilteredCoins(filtered);
  };

  if (error) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchCoins} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <FaChartLine className="hero-icon" />
              Track Crypto Markets
            </h1>
            <p className="hero-description">
              Real-time cryptocurrency prices, market cap, and trading volume
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="search-section">
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <button 
            className={`favorites-toggle ${showFavoritesOnly ? 'active' : ''}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <FaStar className="star-icon" />
            <span>{showFavoritesOnly ? 'Show All' : 'Favorites'}</span>
          </button>
        </div>

        {/* Stats Section */}
        {!loading && (
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-info">
                <div className="stat-value">{coins.length}</div>
                <div className="stat-label">Total Coins</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <div className="stat-value">
                  {JSON.parse(localStorage.getItem('cryptoFavorites') || '[]').length}
                </div>
                <div className="stat-label">Favorites</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-info">
                <div className="stat-value">
                  {JSON.parse(localStorage.getItem('cryptoPortfolio') || '[]').length}
                </div>
                <div className="stat-label">Portfolio Items</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <div className="stat-value">
                  {coins.filter(c => c.price_change_percentage_24h > 10).length}
                </div>
                <div className="stat-label">Hot Coins (&gt;10%)</div>
              </div>
            </div>
          </div>
        )}

        {/* Coin List */}
        {loading ? (
          <Loader message="Loading cryptocurrency data..." />
        ) : (
          <CoinList 
            coins={filteredCoins}
            currency={currency}
            loading={false}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
