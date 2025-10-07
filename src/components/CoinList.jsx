import React, { useState } from 'react';
import CoinCard from './CoinCard';
import { FaFilter } from 'react-icons/fa';
import './CoinList.css';

const CoinList = ({ coins, currency, loading }) => {
  const [sortBy, setSortBy] = useState('market_cap_rank');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const sortedCoins = [...coins].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'market_cap_rank') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  if (loading) {
    return (
      <div className="coin-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading coins...</p>
      </div>
    );
  }

  if (coins.length === 0) {
    return (
      <div className="no-results">
        <p>No coins found</p>
      </div>
    );
  }

  return (
    <div className="coin-list-container">
      <div className="coin-list-header">
        <h2>All Cryptocurrencies</h2>
        <div className="sort-controls">
          <FaFilter className="filter-icon" />
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="market_cap_rank">Rank</option>
            <option value="current_price">Price</option>
            <option value="price_change_percentage_24h">24h Change</option>
            <option value="market_cap">Market Cap</option>
            <option value="total_volume">Volume</option>
          </select>
          <button 
            className="sort-order-button"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="coin-list-grid">
        {sortedCoins.map((coin) => (
          <CoinCard 
            key={coin.id} 
            coin={coin} 
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
};

export default CoinList;
