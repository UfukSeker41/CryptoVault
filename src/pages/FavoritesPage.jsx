import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrencyContext } from '../context/CurrencyContext';
import { getCoins } from '../services/api';
import { getFavorites, removeFromFavorites } from '../utils/localStorage';
import { formatPrice, formatPercentage } from '../utils/formatNumber';
import { FaStar, FaHeart, FaArrowUp, FaArrowDown, FaTrash, FaQuestionCircle } from 'react-icons/fa';
import Loader from '../components/Loader';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { currency } = useContext(CurrencyContext);
  const [favoriteCoins, setFavoriteCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    fetchFavoriteCoins();
    const interval = setInterval(fetchFavoriteCoins, 300000); // 5 dakikada bir
    return () => clearInterval(interval);
  }, [currency]);

  const fetchFavoriteCoins = async () => {
    try {
      const favorites = getFavorites();
      if (favorites.length === 0) {
        setFavoriteCoins([]);
        setLoading(false);
        return;
      }

      const allCoins = await getCoins(currency);
      const favCoins = allCoins.filter(coin => favorites.includes(coin.id));
      setFavoriteCoins(favCoins);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorite coins:', error);
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (coinId, e) => {
    e.stopPropagation();
    if (window.confirm('Favorilerden çıkarmak istediğinize emin misiniz?')) {
      removeFromFavorites(coinId);
      setFavoriteCoins(favoriteCoins.filter(coin => coin.id !== coinId));
    }
  };

  const handleCoinClick = (coinId) => {
    navigate(`/coin/${coinId}`);
  };

  if (loading) {
    return <Loader message="Favoriler yükleniyor..." />;
  }

  return (
    <div className="favorites-page">
      <div className="container">
        {/* Help Button */}
        <button 
          className="help-button-float"
          onClick={() => setShowHelp(!showHelp)}
          title="Favoriler Nedir?"
        >
          <FaQuestionCircle />
        </button>

        {/* Help Panel */}
        {showHelp && (
          <div className="help-panel">
            <div className="help-header">
              <h3>⭐ Favoriler Nedir?</h3>
              <button onClick={() => setShowHelp(false)}>✕</button>
            </div>
            <div className="help-content">
              <div className="help-section">
                <h4>💡 Basit Anlatım:</h4>
                <p>Favoriler = Kısa liste! İlgilendiğiniz kripto paraları buraya kaydediyorsunuz.</p>
              </div>
              
              <div className="help-section">
                <h4>🎯 Nasıl Kullanılır?</h4>
                <ol>
                  <li>Ana sayfada beğendiğin bir coin'e tıkla</li>
                  <li>Yıldız (⭐) ikonuna bas</li>
                  <li>Favorilere eklendi! ✅</li>
                  <li>Buradan hızlıca takip et</li>
                </ol>
              </div>

              <div className="help-section">
                <h4>✨ Neden Kullanmalıyım?</h4>
                <ul>
                  <li><strong>Hızlı Erişim:</strong> 100+ coin arasında kaybolma!</li>
                  <li><strong>Odaklan:</strong> Sadece ilgilendiğin coinler</li>
                  <li><strong>Takip Et:</strong> Fiyat değişimlerini gözle</li>
                  <li><strong>Karşılaştır:</strong> Favorilerin performansını gör</li>
                </ul>
              </div>

              <div className="help-section example">
                <h4>📖 İpucu:</h4>
                <p>Bitcoin ve Ethereum'u favorilere ekle, günlük kontrol et!</p>
                <p className="tip">💡 5-10 coin yeterli. Çok ekleme, karışır! 😊</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="favorites-header">
          <div className="favorites-title">
            <FaHeart className="title-icon" />
            <div>
              <h1>Favorilerim</h1>
              <p className="subtitle">Beğendiğiniz kripto paralara hızlı erişin</p>
            </div>
          </div>
        </div>

        {favoriteCoins.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-icon">⭐</div>
            <h2>Henüz Favori Eklemediniz</h2>
            <p>İlgilendiğiniz kripto paraları favorilere ekleyerek hızlıca takip edin!</p>
            
            <div className="empty-guide">
              <h3>🎯 Nasıl Favori Eklerim?</h3>
              <div className="guide-steps">
                <div className="guide-step">
                  <div className="step-icon">1️⃣</div>
                  <div className="step-content">
                    <strong>Ana Sayfaya Git</strong>
                    <p>Dashboard'da 100+ coin var</p>
                  </div>
                </div>
                <div className="guide-arrow">→</div>
                <div className="guide-step">
                  <div className="step-icon">2️⃣</div>
                  <div className="step-content">
                    <strong>Coin Seç</strong>
                    <p>Bitcoin, Ethereum vb.</p>
                  </div>
                </div>
                <div className="guide-arrow">→</div>
                <div className="guide-step">
                  <div className="step-icon">⭐</div>
                  <div className="step-content">
                    <strong>Yıldıza Tıkla</strong>
                    <p>Favorilere eklendi!</p>
                  </div>
                </div>
              </div>

              <button 
                className="go-dashboard-btn"
                onClick={() => navigate('/')}
              >
                🚀 Ana Sayfaya Git
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="favorites-stats">
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <div className="stat-value">{favoriteCoins.length}</div>
                  <div className="stat-label">Favori Coin</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🚀</div>
                <div className="stat-info">
                  <div className="stat-value">
                    {favoriteCoins.filter(c => c.price_change_percentage_24h > 0).length}
                  </div>
                  <div className="stat-label">Yükselişte</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📉</div>
                <div className="stat-info">
                  <div className="stat-value">
                    {favoriteCoins.filter(c => c.price_change_percentage_24h < 0).length}
                  </div>
                  <div className="stat-label">Düşüşte</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-info">
                  <div className="stat-value">
                    {favoriteCoins.filter(c => Math.abs(c.price_change_percentage_24h) > 5).length}
                  </div>
                  <div className="stat-label">Yüksek Volatilite</div>
                </div>
              </div>
            </div>

            {/* Favorites List */}
            <div className="favorites-list">
              {favoriteCoins.map((coin) => {
                const priceChange = coin.price_change_percentage_24h || 0;
                const isPositive = priceChange >= 0;

                return (
                  <div 
                    key={coin.id} 
                    className="favorite-card"
                    onClick={() => handleCoinClick(coin.id)}
                  >
                    <div className="favorite-main">
                      <div className="coin-info">
                        <img src={coin.image} alt={coin.name} className="coin-image" />
                        <div className="coin-details">
                          <h3>{coin.name}</h3>
                          <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="coin-price-section">
                        <div className="current-price">
                          {formatPrice(coin.current_price)}
                        </div>
                        <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
                          {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                          <span>{formatPercentage(Math.abs(priceChange))}</span>
                        </div>
                      </div>

                      <button
                        className="remove-favorite-btn"
                        onClick={(e) => handleRemoveFavorite(coin.id, e)}
                        title="Favorilerden Çıkar"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="favorite-stats">
                      <div className="stat">
                        <span className="stat-label">Rank</span>
                        <span className="stat-value">#{coin.market_cap_rank}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">24h High</span>
                        <span className="stat-value">${coin.high_24h?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">24h Low</span>
                        <span className="stat-value">${coin.low_24h?.toFixed(2) || 'N/A'}</span>
                      </div>
                    </div>

                    {coin.sparkline_in_7d && (
                      <div className="sparkline">
                        <svg width="100%" height="40" preserveAspectRatio="none">
                          <polyline
                            points={coin.sparkline_in_7d.price
                              .map((price, index) => {
                                const x = (index / (coin.sparkline_in_7d.price.length - 1)) * 100;
                                const minPrice = Math.min(...coin.sparkline_in_7d.price);
                                const maxPrice = Math.max(...coin.sparkline_in_7d.price);
                                const y = 100 - ((price - minPrice) / (maxPrice - minPrice)) * 100;
                                return `${x},${y}`;
                              })
                              .join(' ')}
                            fill="none"
                            stroke={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'}
                            strokeWidth="2"
                          />
                        </svg>
                        <div className="sparkline-label">7 günlük trend</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
