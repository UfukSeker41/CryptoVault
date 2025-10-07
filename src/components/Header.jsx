import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { FaMoon, FaSun, FaBitcoin } from 'react-icons/fa';
import './Header.css';

const Header = ({ globalData }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currency, changeCurrency } = useContext(CurrencyContext);

  const currencies = ['USD', 'EUR', 'TRY', 'BTC'];

  const formatMarketCap = (value) => {
    if (!value) return '$0';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <FaBitcoin className="logo-icon" />
            <span className="logo-text">CryptoVault</span>
          </Link>

          {/* Global Stats */}
          {globalData && (
            <div className="global-stats">
              <div className="stat">
                <span className="stat-label">Market Cap:</span>
                <span className="stat-value">
                  {formatMarketCap(globalData.total_market_cap?.[currency])}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">24h Vol:</span>
                <span className="stat-value">
                  {formatMarketCap(globalData.total_volume?.[currency])}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">BTC Dom:</span>
                <span className="stat-value">
                  {globalData.market_cap_percentage?.btc?.toFixed(1)}%
                </span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="header-controls">
            {/* Currency Selector */}
            <select 
              className="currency-selector"
              value={currency.toUpperCase()}
              onChange={(e) => changeCurrency(e.target.value)}
            >
              {currencies.map(curr => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>

            {/* Theme Toggle */}
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <Link to="/" className="nav-link">
            Dashboard
          </Link>
          <Link to="/portfolio" className="nav-link">
            Portfolio
          </Link>
          <Link to="/favorites" className="nav-link">
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
