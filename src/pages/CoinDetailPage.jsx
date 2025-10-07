import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCoinDetail, getCoinChart } from '../services/api';
import { CurrencyContext } from '../context/CurrencyContext';
import { isFavorite, addToFavorites, removeFromFavorites } from '../utils/localStorage';
import { formatPrice, formatMarketCap, formatPercentage, formatNumber } from '../utils/formatNumber';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FaStar, FaRegStar, FaArrowLeft, FaArrowUp, FaArrowDown, FaQuestionCircle } from 'react-icons/fa';
import Loader from '../components/Loader';
import './CoinDetailPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CoinDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency } = useContext(CurrencyContext);
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [timeRange, setTimeRange] = useState('7');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    fetchCoinData();
    setFavorite(isFavorite(id));
  }, [id, currency, timeRange]);

  const fetchCoinData = async () => {
    try {
      setLoading(true);
      const [coinData, chartDataRaw] = await Promise.all([
        getCoinDetail(id),
        getCoinChart(id, timeRange, currency)
      ]);

      setCoin(coinData);
      processChartData(chartDataRaw);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coin data:', error);
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    const prices = data.prices;
    const labels = prices.map(price => {
      const date = new Date(price[0]);
      if (timeRange === '1') {
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      } else if (timeRange <= '30') {
        return date.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
      } else {
        return date.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' });
      }
    });

    const values = prices.map(price => price[1]);
    const isPositive = values[values.length - 1] >= values[0];

    setChartData({
      labels: labels,
      datasets: [{
        label: `Fiyat (${currency.toUpperCase()})`,
        data: values,
        borderColor: isPositive ? '#00c853' : '#ff5252',
        backgroundColor: isPositive 
          ? 'rgba(0, 200, 83, 0.1)' 
          : 'rgba(255, 82, 82, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: isPositive ? '#00c853' : '#ff5252',
        borderWidth: 3
      }]
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: '#1a1f2e',
        titleColor: '#ffffff',
        bodyColor: '#8899a6',
        borderColor: '#2d3748',
        borderWidth: 2,
        padding: 16,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 16,
          weight: 'bold'
        },
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `Fiyat: $${context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'var(--border)'
        },
        ticks: {
          color: 'var(--text-muted)',
          maxTicksLimit: 8
        }
      },
      y: {
        grid: {
          color: 'var(--border)',
          drawBorder: false
        },
        ticks: {
          color: 'var(--text-muted)',
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFromFavorites(id);
      setFavorite(false);
    } else {
      addToFavorites(id);
      setFavorite(true);
    }
  };

  const timeRanges = [
    { label: '24S', value: '1' },
    { label: '7G', value: '7' },
    { label: '1A', value: '30' },
    { label: '3A', value: '90' },
    { label: '1Y', value: '365' },
    { label: 'MAX', value: 'max' }
  ];

  if (loading || !coin) {
    return <Loader message="Coin bilgileri yükleniyor..." />;
  }

  const priceChange = coin.market_data?.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="coin-detail-page">
      <div className="container">
        {/* Help Button */}
        <button 
          className="help-button-float"
          onClick={() => setShowHelp(!showHelp)}
        >
          <FaQuestionCircle />
        </button>

        {/* Help Panel */}
        {showHelp && (
          <div className="help-panel">
            <div className="help-header">
              <h3>📊 Coin Detay Sayfası</h3>
              <button onClick={() => setShowHelp(false)}>✕</button>
            </div>
            <div className="help-content">
              <div className="help-section">
                <h4>💡 Bu Sayfa Ne İşe Yarar?</h4>
                <p>Bir kripto para hakkında her şeyi burada görürsün!</p>
              </div>
              
              <div className="help-section">
                <h4>📈 Grafik Nasıl Okunur?</h4>
                <ul>
                  <li><strong>🟢 Yeşil Çizgi:</strong> Fiyat yükseliyor</li>
                  <li><strong>🔴 Kırmızı Çizgi:</strong> Fiyat düşüyor</li>
                  <li><strong>Zaman Seçimi:</strong> 24S, 7G, 1A... butonları</li>
                  <li><strong>Grafik Üzerine Gel:</strong> O andaki fiyatı gösterir</li>
                </ul>
              </div>

              <div className="help-section">
                <h4>📊 Sayılar Ne Anlama Geliyor?</h4>
                <ul>
                  <li><strong>Şu Anki Fiyat:</strong> Coin'in şimdiki değeri</li>
                  <li><strong>24h Değişim:</strong> Son 24 saatte % kaç değişti</li>
                  <li><strong>Market Cap:</strong> Toplam piyasa değeri (ne kadar büyük)</li>
                  <li><strong>Volume:</strong> Ne kadar alım-satım var</li>
                  <li><strong>ATH:</strong> All Time High = En yüksek fiyat</li>
                  <li><strong>ATL:</strong> All Time Low = En düşük fiyat</li>
                </ul>
              </div>

              <div className="help-section example">
                <h4>💡 İpucu:</h4>
                <p>Sağ üstteki ⭐ yıldıza tıklayarak favorilere ekle!</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="detail-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Geri
          </button>

          <button 
            className={`favorite-button-large ${favorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
          >
            {favorite ? <FaStar /> : <FaRegStar />}
            {favorite ? 'Favorilerde' : 'Favorilere Ekle'}
          </button>
        </div>

        {/* Coin Info */}
        <div className="coin-header">
          <div className="coin-main-info">
            <img src={coin.image?.large} alt={coin.name} className="coin-image-large" />
            <div>
              <h1>{coin.name}</h1>
              <span className="coin-symbol-large">{coin.symbol?.toUpperCase()}</span>
              <span className="coin-rank">Rank #{coin.market_cap_rank}</span>
            </div>
          </div>

          <div className="coin-price-info">
            <div className="current-price-large">
              ${formatNumber(coin.market_data?.current_price?.[currency] || 0)}
            </div>
            <div className={`price-change-large ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <FaArrowUp /> : <FaArrowDown />}
              {formatPercentage(Math.abs(priceChange))} (24h)
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-section">
          <div className="chart-header">
            <h2>📈 Fiyat Grafiği</h2>
            <div className="time-range-selector">
              {timeRanges.map(range => (
                <button
                  key={range.value}
                  className={`time-range-btn ${timeRange === range.value ? 'active' : ''}`}
                  onClick={() => setTimeRange(range.value)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          {chartData && (
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Market Stats */}
        <div className="market-stats">
          <h2>📊 Piyasa İstatistikleri</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-label">Market Cap</div>
              <div className="stat-value">
                {formatMarketCap(coin.market_data?.market_cap?.[currency] || 0)}
              </div>
              <div className="stat-change">
                {coin.market_data?.market_cap_change_percentage_24h?.toFixed(2)}% (24h)
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-label">24h Volume</div>
              <div className="stat-value">
                {formatMarketCap(coin.market_data?.total_volume?.[currency] || 0)}
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-label">Dolaşımdaki Arz</div>
              <div className="stat-value">
                {formatNumber(coin.market_data?.circulating_supply || 0)}
              </div>
              <div className="stat-subtitle">{coin.symbol?.toUpperCase()}</div>
            </div>

            <div className="stat-box">
              <div className="stat-label">Toplam Arz</div>
              <div className="stat-value">
                {coin.market_data?.total_supply 
                  ? formatNumber(coin.market_data.total_supply)
                  : '∞'}
              </div>
              <div className="stat-subtitle">{coin.symbol?.toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Price Stats */}
        <div className="price-stats">
          <h2>💰 Fiyat İstatistikleri</h2>
          <div className="price-stats-grid">
            <div className="price-stat-item">
              <span className="label">24h High:</span>
              <span className="value green">
                ${formatNumber(coin.market_data?.high_24h?.[currency] || 0)}
              </span>
            </div>
            <div className="price-stat-item">
              <span className="label">24h Low:</span>
              <span className="value red">
                ${formatNumber(coin.market_data?.low_24h?.[currency] || 0)}
              </span>
            </div>
            <div className="price-stat-item">
              <span className="label">All Time High:</span>
              <span className="value">
                ${formatNumber(coin.market_data?.ath?.[currency] || 0)}
              </span>
              <span className="date">
                {coin.market_data?.ath_date?.[currency] 
                  ? new Date(coin.market_data.ath_date[currency]).toLocaleDateString('tr-TR')
                  : 'N/A'}
              </span>
            </div>
            <div className="price-stat-item">
              <span className="label">All Time Low:</span>
              <span className="value">
                ${formatNumber(coin.market_data?.atl?.[currency] || 0)}
              </span>
              <span className="date">
                {coin.market_data?.atl_date?.[currency]
                  ? new Date(coin.market_data.atl_date[currency]).toLocaleDateString('tr-TR')
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {coin.description?.en && (
          <div className="description-section">
            <h2>📖 Hakkında</h2>
            <div 
              className="description-content"
              dangerouslySetInnerHTML={{ 
                __html: coin.description.en.split('. ').slice(0, 3).join('. ') + '.'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinDetailPage;
