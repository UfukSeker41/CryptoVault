import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { formatPrice, formatMarketCap, formatPercentage } from '../utils/formatNumber';
import { isFavorite, addToFavorites, removeFromFavorites } from '../utils/localStorage';
import './CoinCard.css';

const CoinCard = ({ coin, currency }) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(isFavorite(coin.id));

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(coin.id);
      setFavorite(false);
    } else {
      addToFavorites(coin.id);
      setFavorite(true);
    }
  };

  const handleClick = () => {
    navigate(`/coin/${coin.id}`);
  };

  const priceChange = coin.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="coin-card" onClick={handleClick}>
      <div className="coin-card-header">
        <div className="coin-rank">#{coin.market_cap_rank}</div>
        <button 
          className="favorite-button"
          onClick={handleFavoriteClick}
        >
          {favorite ? (
            <FaStar className="star-icon filled" />
          ) : (
            <FaRegStar className="star-icon" />
          )}
        </button>
      </div>

      <div className="coin-info">
        <img 
          src={coin.image} 
          alt={coin.name}
          className="coin-image"
        />
        <div className="coin-details">
          <h3 className="coin-name">{coin.name}</h3>
          <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
        </div>
      </div>

      <div className="coin-price">
        <div className="price">
          {formatPrice(coin.current_price)}
        </div>
        <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <FaArrowUp /> : <FaArrowDown />}
          <span>{formatPercentage(Math.abs(priceChange))}</span>
        </div>
      </div>

      <div className="coin-stats">
        <div className="stat">
          <span className="stat-label">Market Cap</span>
          <span className="stat-value">{formatMarketCap(coin.market_cap)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Volume (24h)</span>
          <span className="stat-value">{formatMarketCap(coin.total_volume)}</span>
        </div>
      </div>

      {coin.sparkline_in_7d && coin.sparkline_in_7d.price && coin.sparkline_in_7d.price.length > 0 && (
        <div className="sparkline">
          <svg width="100%" height="50" preserveAspectRatio="none">
            <polyline
              points={coin.sparkline_in_7d.price
                .filter(price => price !== null && price !== undefined && !isNaN(price))
                .map((price, index, filteredPrices) => {
                  if (filteredPrices.length === 0) return '';
                  const x = (index / (filteredPrices.length - 1 || 1)) * 100;
                  const minPrice = Math.min(...filteredPrices);
                  const maxPrice = Math.max(...filteredPrices);
                  const priceRange = maxPrice - minPrice;
                  if (priceRange === 0) return `${x},50`;
                  const y = 100 - ((price - minPrice) / priceRange) * 100;
                  return `${x},${y}`;
                })
                .join(' ')}
              fill="none"
              stroke={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'}
              strokeWidth="2"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CoinCard;
