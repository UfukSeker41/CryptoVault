import React, { useState, useContext, useEffect } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';
import { getCoins } from '../services/api';
import { FaTimes, FaSearch } from 'react-icons/fa';
import './AddTransactionModal.css';

const AddTransactionModal = ({ onClose, currentPrices }) => {
  const { addTransaction } = useContext(PortfolioContext);
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = useState('buy');

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      const data = await getCoins('usd', 1);
      setCoins(data);
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);
    setBuyPrice(coin.current_price.toString());
    setSearchTerm('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCoin || !amount || !buyPrice) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    const transaction = {
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice),
      date: date,
      type: transactionType
    };

    addTransaction(transaction);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>İşlem Ekle</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Coin Selection */}
            <div className="form-group">
              <label>Kripto Para Seçin</label>
              {selectedCoin ? (
                <div className="selected-coin">
                  <img src={selectedCoin.image} alt={selectedCoin.name} />
                  <div>
                    <div className="coin-name">{selectedCoin.name}</div>
                    <div className="coin-symbol">{selectedCoin.symbol.toUpperCase()}</div>
                  </div>
                  <button 
                    type="button"
                    className="change-btn"
                    onClick={() => setSelectedCoin(null)}
                  >
                    Değiştir
                  </button>
                </div>
              ) : (
                <>
                  <div className="search-input-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Bitcoin, Ethereum ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  {searchTerm && (
                    <div className="coin-dropdown">
                      {filteredCoins.slice(0, 5).map(coin => (
                        <div 
                          key={coin.id}
                          className="coin-option"
                          onClick={() => handleSelectCoin(coin)}
                        >
                          <img src={coin.image} alt={coin.name} />
                          <div>
                            <div className="coin-name">{coin.name}</div>
                            <div className="coin-symbol">{coin.symbol.toUpperCase()}</div>
                          </div>
                          <div className="coin-price">
                            ${coin.current_price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Transaction Type */}
            <div className="form-group">
              <label>İşlem Tipi</label>
              <div className="transaction-type-buttons">
                <button
                  type="button"
                  className={`type-btn ${transactionType === 'buy' ? 'active' : ''}`}
                  onClick={() => setTransactionType('buy')}
                >
                  💰 Alış
                </button>
                <button
                  type="button"
                  className={`type-btn ${transactionType === 'sell' ? 'active' : ''}`}
                  onClick={() => setTransactionType('sell')}
                >
                  💸 Satış
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label>
                Miktar
                {selectedCoin && ` (${selectedCoin.symbol.toUpperCase()})`}
              </label>
              <input
                type="number"
                step="any"
                placeholder="Örn: 0.5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                required
              />
              <div className="input-hint">
                💡 Kaç adet {selectedCoin?.name || 'coin'} aldınız?
              </div>
            </div>

            {/* Buy Price */}
            <div className="form-group">
              <label>Alış Fiyatı (USD)</label>
              <input
                type="number"
                step="any"
                placeholder="Örn: 40000"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                className="form-input"
                required
              />
              <div className="input-hint">
                💡 {selectedCoin && `Şu anki fiyat: $${selectedCoin.current_price.toFixed(2)}`}
              </div>
            </div>

            {/* Date */}
            <div className="form-group">
              <label>Tarih</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Summary */}
            {selectedCoin && amount && buyPrice && (
              <div className="transaction-summary">
                <h3>📊 Özet</h3>
                <div className="summary-row">
                  <span>Toplam Yatırım:</span>
                  <strong>${(parseFloat(amount) * parseFloat(buyPrice)).toFixed(2)}</strong>
                </div>
                <div className="summary-row">
                  <span>Şu Anki Değer:</span>
                  <strong>${(parseFloat(amount) * selectedCoin.current_price).toFixed(2)}</strong>
                </div>
                <div className="summary-row">
                  <span>Potansiyel Kar/Zarar:</span>
                  <strong className={
                    (parseFloat(amount) * selectedCoin.current_price) - (parseFloat(amount) * parseFloat(buyPrice)) >= 0
                      ? 'profit' : 'loss'
                  }>
                    ${((parseFloat(amount) * selectedCoin.current_price) - (parseFloat(amount) * parseFloat(buyPrice))).toFixed(2)}
                  </strong>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={onClose}>
                İptal
              </button>
              <button type="submit" className="submit-btn">
                💾 Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
