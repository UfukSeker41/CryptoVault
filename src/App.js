import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { PortfolioProvider } from './context/PortfolioContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import PortfolioPage from './pages/PortfolioPage';
import FavoritesPage from './pages/FavoritesPage';
import CoinDetailPage from './pages/CoinDetailPage';
import { getGlobalData } from './services/api';
import './styles/global.css';

function App() {
  const [globalData, setGlobalData] = useState(null);

  useEffect(() => {
    fetchGlobalData();
    const interval = setInterval(fetchGlobalData, 120000); // Update every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchGlobalData = async () => {
    try {
      const data = await getGlobalData();
      setGlobalData(data.data);
    } catch (error) {
      console.error('Error fetching global data:', error);
    }
  };

  return (
    <ThemeProvider>
      <CurrencyProvider>
        <PortfolioProvider>
          <Router>
            <div className="App">
              <Header globalData={globalData} />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/coin/:id" element={<CoinDetailPage />} />
              </Routes>
            </div>
          </Router>
        </PortfolioProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
