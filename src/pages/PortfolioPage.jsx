import React, { useState, useContext, useEffect } from 'react';
import { CurrencyContext } from '../context/CurrencyContext';
import { PortfolioContext } from '../context/PortfolioContext';
import { getCoins } from '../services/api';
import { calculateHoldings, calculatePortfolioValue, calculateAllocation } from '../utils/calculateProfit';
import AddTransactionModal from '../components/AddTransactionModal';
import { FaPlus, FaWallet, FaChartPie, FaArrowUp, FaArrowDown, FaTrash, FaEdit, FaQuestionCircle } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './PortfolioPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioPage = () => {
  const { currency } = useContext(CurrencyContext);
  const { portfolio, removeTransaction } = useContext(PortfolioContext);
  const [showModal, setShowModal] = useState(false);
  const [currentPrices, setCurrentPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    fetchCurrentPrices();
    const interval = setInterval(fetchCurrentPrices, 300000); // 5 dakikada bir
    return () => clearInterval(interval);
  }, [currency]);

  const fetchCurrentPrices = async () => {
    try {
      const coins = await getCoins(currency);
      const prices = {};
      coins.forEach(coin => {
        prices[coin.id] = coin.current_price;
      });
      setCurrentPrices(prices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setLoading(false);
    }
  };

  const holdings = calculateHoldings(portfolio, currentPrices);
  const portfolioValue = calculatePortfolioValue(portfolio, currentPrices);
  const allocation = calculateAllocation(holdings);

  const pieData = {
    labels: allocation.map(a => a.coinSymbol.toUpperCase()),
    datasets: [{
      data: allocation.map(a => a.percentage),
      backgroundColor: [
        '#f7931a', // Bitcoin Orange
        '#627eea', // Ethereum Blue
        '#00d395', // Green
        '#2196f3', // Blue
        '#9c27b0', // Purple
        '#ff5252', // Red
        '#ffc107', // Yellow
        '#00bcd4', // Cyan
        '#ff9800', // Orange
        '#4caf50', // Green
      ],
      borderWidth: 2,
      borderColor: 'var(--bg-primary)',
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--text-primary)',
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'var(--bg-card)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.toFixed(2)}%`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="portfolio-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <div className="container">
        {/* Help Button */}
        <button 
          className="help-button-float"
          onClick={() => setShowHelp(!showHelp)}
          title="Portföy Nedir?"
        >
          <FaQuestionCircle />
        </button>

        {/* Help Panel */}
        {showHelp && (
          <div className="help-panel">
            <div className="help-header">
              <h3>📚 Portföy Nedir?</h3>
              <button onClick={() => setShowHelp(false)}>✕</button>
            </div>
            <div className="help-content">
              <div className="help-section">
                <h4>💡 Basit Anlatım:</h4>
                <p>Portföy = Cüzdanınız! Kripto paralarınızı buraya kaydediyorsunuz.</p>
              </div>
              
              <div className="help-section">
                <h4>🎯 Nasıl Kullanılır?</h4>
                <ol>
                  <li><strong>"İşlem Ekle"</strong> butonuna tıkla</li>
                  <li>Hangi kripto parayı aldın? (örn: Bitcoin)</li>
                  <li>Ne kadar aldın? (örn: 0.5 BTC)</li>
                  <li>Kaça aldın? (örn: $40,000)</li>
                  <li>Kaydet!</li>
                </ol>
              </div>

              <div className="help-section">
                <h4>💰 Ne Göreceksiniz?</h4>
                <ul>
                  <li><strong>Toplam Değer:</strong> Şu an paranız ne kadar?</li>
                  <li><strong>Kar/Zarar:</strong> Kazandın mı, kaybettin mi?</li>
                  <li><strong>🟢 Yeşil:</strong> Kazanıyorsun! 🎉</li>
                  <li><strong>🔴 Kırmızı:</strong> Kaybediyorsun 😔</li>
                </ul>
              </div>

              <div className="help-section example">
                <h4>📖 Örnek:</h4>
                <p><strong>Senaryo:</strong> 0.1 Bitcoin'i $30,000'dan aldın.</p>
                <p><strong>Toplam Ödeme:</strong> 0.1 × $30,000 = $3,000</p>
                <p><strong>Bitcoin Şimdi:</strong> $45,000</p>
                <p><strong>Şimdiki Değer:</strong> 0.1 × $45,000 = $4,500</p>
                <p className="profit">✅ Kar: $1,500 (+50%) 🚀</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="portfolio-header">
          <div className="portfolio-title">
            <FaWallet className="title-icon" />
            <div>
              <h1>Portföyüm</h1>
              <p className="subtitle">Kripto yatırımlarınızı takip edin</p>
            </div>
          </div>
          <button 
            className="add-transaction-btn"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> İşlem Ekle
          </button>
        </div>

        {portfolio.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <h2>Portföyünüz Boş</h2>
            <p>Henüz hiç kripto para eklemediniz.</p>
            <p className="empty-hint">
              👆 <strong>"İşlem Ekle"</strong> butonuna tıklayarak başlayın!
            </p>
            <div className="empty-example">
              <h3>🎓 Nasıl Başlarım?</h3>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <strong>İşlem Ekle'ye Tıkla</strong>
                    <p>Yukarıdaki yeşil butona bas</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <strong>Coin Seç</strong>
                    <p>Bitcoin, Ethereum vb.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <strong>Bilgileri Gir</strong>
                    <p>Miktar ve fiyat</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <strong>Takip Et!</strong>
                    <p>Kar/zarar otomatik hesaplanır</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Portfolio Summary */}
            <div className="portfolio-summary">
              <div className="summary-card main-card">
                <div className="summary-label">Toplam Portföy Değeri</div>
                <div className="summary-value large">
                  ${portfolioValue.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`summary-change ${portfolioValue.profit >= 0 ? 'positive' : 'negative'}`}>
                  {portfolioValue.profit >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                  ${Math.abs(portfolioValue.profit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {' '}({portfolioValue.profitPercentage.toFixed(2)}%)
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-label">Toplam Yatırım</div>
                <div className="summary-value">
                  ${portfolioValue.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="summary-info">İlk yatırım tutarı</div>
              </div>

              <div className="summary-card">
                <div className="summary-label">Toplam Coin</div>
                <div className="summary-value">{holdings.length}</div>
                <div className="summary-info">Farklı kripto para</div>
              </div>

              <div className="summary-card">
                <div className="summary-label">İşlem Sayısı</div>
                <div className="summary-value">{portfolio.length}</div>
                <div className="summary-info">Alım/satım kaydı</div>
              </div>
            </div>

            {/* Holdings and Chart */}
            <div className="portfolio-content">
              {/* Holdings List */}
              <div className="holdings-section">
                <h2>
                  <FaWallet /> Varlıklarım
                </h2>
                <div className="holdings-list">
                  {holdings.map((holding) => {
                    const profit = holding.profit || 0;
                    const profitPercentage = holding.profitPercentage || 0;
                    const isProfit = profit >= 0;

                    return (
                      <div key={holding.coinId} className="holding-card">
                        <div className="holding-header">
                          <div className="holding-info">
                            <h3>{holding.coinName}</h3>
                            <span className="coin-symbol">{holding.coinSymbol.toUpperCase()}</span>
                          </div>
                          <div className="holding-amount">
                            {holding.totalAmount.toFixed(8)} {holding.coinSymbol.toUpperCase()}
                          </div>
                        </div>

                        <div className="holding-stats">
                          <div className="stat">
                            <span className="stat-label">Ortalama Alış</span>
                            <span className="stat-value">
                              ${holding.avgBuyPrice?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Şu Anki Fiyat</span>
                            <span className="stat-value">
                              ${holding.currentPrice?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Toplam Değer</span>
                            <span className="stat-value">
                              ${holding.currentValue?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Kar/Zarar</span>
                            <span className={`stat-value ${isProfit ? 'profit' : 'loss'}`}>
                              {isProfit ? '+' : ''}${profit.toFixed(2)} ({profitPercentage.toFixed(2)}%)
                            </span>
                          </div>
                        </div>

                        <div className="holding-transactions">
                          <h4>İşlemler ({holding.transactions.length})</h4>
                          {holding.transactions.map((transaction) => (
                            <div key={transaction.id} className="transaction-item">
                              <div className="transaction-info">
                                <span className="transaction-amount">
                                  {transaction.amount} {transaction.coinSymbol.toUpperCase()}
                                </span>
                                <span className="transaction-price">
                                  @ ${transaction.buyPrice.toFixed(2)}
                                </span>
                                <span className="transaction-date">
                                  {new Date(transaction.date).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                              <button
                                className="delete-transaction-btn"
                                onClick={() => {
                                  if (window.confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
                                    removeTransaction(transaction.id);
                                  }
                                }}
                                title="Sil"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Allocation Chart */}
              {holdings.length > 0 && (
                <div className="chart-section">
                  <h2>
                    <FaChartPie /> Dağılım
                  </h2>
                  <div className="chart-container">
                    <Pie data={pieData} options={pieOptions} />
                  </div>
                  <div className="allocation-legend">
                    {allocation.map((item, index) => (
                      <div key={item.coinId} className="allocation-item">
                        <div 
                          className="allocation-color" 
                          style={{ backgroundColor: pieData.datasets[0].backgroundColor[index] }}
                        ></div>
                        <div className="allocation-info">
                          <span className="allocation-name">{item.coinSymbol.toUpperCase()}</span>
                          <span className="allocation-percentage">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <AddTransactionModal 
          onClose={() => setShowModal(false)}
          currentPrices={currentPrices}
        />
      )}
    </div>
  );
};

export default PortfolioPage;
