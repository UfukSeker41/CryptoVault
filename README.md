# 💰 CryptoVault - Cryptocurrency Tracker

Modern, gerçek zamanlı kripto para takip uygulaması. React 18 ile geliştirilmiştir.

![CryptoVault](https://img.shields.io/badge/React-18-blue)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Özellikler

### ✅ Ana Özellikler
- 📊 **Gerçek Zamanlı Fiyat Takibi** - Top 100 kripto para ile canlı fiyatlar
- 🔍 **Gelişmiş Arama** - Coin ismi veya sembolü ile arama
- ⭐ **Favoriler Sistemi** - Favori coinlerinizi kaydedin ve hızlı erişin
- 💼 **Portföy Yönetimi** - Yatırımlarınızı takip edin, kar/zarar hesaplayın
- 📈 **İnteraktif Grafikler** - 24h, 7D, 1M, 3M, 1Y, Max fiyat grafikleri
- 💱 **Çoklu Para Birimi** - USD, EUR, TRY, BTC desteği
- 🌓 **Karanlık/Aydınlık Tema** - Göz dostu dark mode
- 📱 **Responsive Tasarım** - Mobil, tablet, desktop uyumlu
- 🌍 **Global Market İstatistikleri** - Toplam market cap, hacim, BTC dominansı

### 🎓 Başlangıç Dostu
- 📚 **Yardım Panelleri** - Her sayfada detaylı açıklamalar
- 🇹🇷 **Türkçe Arayüz** - Tamamen Türkçe kullanıcı deneyimi
- 💡 **Kolay Kullanım** - Kripto bilgisi gerektirmeyen basit arayüz

## 🛠️ Teknoloji Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Chart.js 4.5** - İnteraktif fiyat grafikleri
- **react-chartjs-2** - React wrapper for Chart.js

### API & Data
- **Axios** - HTTP client
- **CoinGecko API** - Ücretsiz kripto para verisi
- **Rate Limiting** - Akıllı istek yönetimi (2 saniye aralıklı)
- **Retry Mechanism** - Otomatik yeniden deneme sistemi
- **Cache System** - 5 dakikalık cache ile hızlı yükleme

### Styling & UI
- **CSS3** - Modern styling with CSS variables
- **Custom Components** - Tamamen özel tasarım
- **Responsive Grid** - Her ekran boyutuna uyumlu
- **Dark/Light Theme** - CSS variables ile tema sistemi

### Data Management
- **React Context API** - Global state management
  - ThemeContext - Tema yönetimi
  - CurrencyContext - Para birimi yönetimi
  - PortfolioContext - Portföy yönetimi
- **LocalStorage** - Kalıcı veri saklama (favorites, portfolio, settings)

## 📦 Kurulum & Çalıştırma

### Gereksinimler
- Node.js 14.0 veya üzeri
- npm veya yarn package manager

### Kurulum Adımları

1. **Projeyi klonlayın**
```bash
git clone <https://github.com/UfukSeker41/CryptoVault>
cd crypto-tracker
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Geliştirme modunda çalıştırın**
```bash
npm start
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde açılacaktır.

- Sayfa otomatik olarak yenilenir
- Kripto verileri her 5 dakikada bir güncellenir
- Cache sistemi ile hızlı yükleme

4. **Production build**
```bash
npm run build
```

Build klasörü dağıtıma hazırdır!

## 🎨 Proje Yapısı

```
crypto-tracker/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/           # Yeniden kullanılabilir componentler
│   │   ├── Header.jsx       # Navigation ve global stats
│   │   ├── CoinCard.jsx     # Coin kartı
│   │   ├── CoinList.jsx     # Coin listesi
│   │   ├── SearchBar.jsx    # Arama çubuğu
│   │   ├── Loader.jsx       # Yükleme animasyonu
│   │   └── AddTransactionModal.jsx  # İşlem ekleme modalı
│   ├── pages/               # Sayfa componentleri
│   │   ├── Dashboard.jsx    # Ana sayfa (Top 100)
│   │   ├── CoinDetailPage.jsx   # Coin detay ve grafikler
│   │   ├── PortfolioPage.jsx    # Portföy yönetimi
│   │   └── FavoritesPage.jsx    # Favoriler
│   ├── services/            # API servisleri
│   │   └── api.js          # CoinGecko API entegrasyonu
│   ├── utils/              # Yardımcı fonksiyonlar
│   │   ├── formatNumber.js  # Sayı formatlama
│   │   ├── localStorage.js  # LocalStorage helpers
│   │   └── calculateProfit.js  # Kar/zarar hesaplama
│   ├── context/            # React Context
│   │   ├── ThemeContext.jsx     # Tema yönetimi
│   │   ├── CurrencyContext.jsx  # Para birimi
│   │   └── PortfolioContext.jsx # Portföy state
│   ├── styles/             # Global stiller
│   │   └── global.css      # CSS variables ve global styles
│   ├── App.js              # Ana component
│   └── index.js            # Entry point
├── package.json
├── README.md
└── KULLANIM_KLAVUZU.md    # Türkçe kullanım kılavuzu
```

## 🌐 API Kullanımı

### CoinGecko API
- **Endpoint**: https://api.coingecko.com/api/v3
- **Rate Limit**: 10-50 requests/minute (Free tier)
- **API Key**: Gerekli değil

### Kullanılan Endpointler:
- `/coins/markets` - Top 100 coin listesi
- `/coins/{id}` - Coin detay bilgileri
- `/coins/{id}/market_chart` - Fiyat grafik verisi
- `/global` - Global market istatistikleri
- `/search/trending` - Trend coinler

### Rate Limiting Stratejisi:
- ⏱️ Her istek arasında 2 saniye bekleme
- 🔄 429 hatası durumunda otomatik retry (2 deneme)
- 📦 5 dakikalık cache sistemi
- ⚡ Cache hit durumunda anında yükleme

## 🎯 Özellik Detayları

### Dashboard (Ana Sayfa)
- Top 100 cryptocurrency listesi
- Gerçek zamanlı fiyat güncellemeleri
- Market cap, volume, 24h değişim bilgileri
- Arama ve sıralama özellikleri
- Favori ekleme/çıkarma

### Coin Detail (Detay Sayfası)
- Detaylı coin bilgileri
- 6 farklı zaman dilimi grafikleri (24h, 7d, 1m, 3m, 1y, max)
- ATH/ATL fiyat bilgileri
- Market cap ve dolaşımdaki arz
- İnteraktif Chart.js grafikleri

### Portfolio (Portföy)
- İşlem ekleme/silme
- Otomatik kar/zarar hesaplama
- Portföy değeri ve dağılım grafiği
- Coin bazında detaylı görünüm
- Yatırım performans takibi

### Favorites (Favoriler)
- Hızlı erişim için favorilere ekleme
- Mini istatistikler
- Fiyat değişim grafikleri
- Tek tıkla favorilerden çıkarma

## 🎯 Geliştirme Aşamaları

### ✅ Phase 1: Temel Yapı (Tamamlandı)
- [x] Proje kurulumu ve bağımlılıklar
- [x] CoinGecko API entegrasyonu
- [x] Rate limiting ve cache sistemi
- [x] Temel component yapısı

### ✅ Phase 2: Ana Özellikler (Tamamlandı)
- [x] Dashboard ile canlı fiyatlar
- [x] Arama ve filtreleme
- [x] Sıralama özellikleri
- [x] Favoriler sistemi
- [x] Theme switcher (Dark/Light)
- [x] Multi-currency support

### ✅ Phase 3: İleri Özellikler (Tamamlandı)
- [x] Coin detay sayfaları
- [x] İnteraktif Chart.js grafikleri
- [x] 6 farklı zaman dilimi (24h, 7d, 1m, 3m, 1y, max)
- [x] Portföy yönetimi
- [x] İşlem ekleme/silme
- [x] Kar/zarar hesaplama
- [x] Portföy dağılım grafiği

### ✅ Phase 4: UX İyileştirmeleri (Tamamlandı)
- [x] Yardım panelleri (her sayfada)
- [x] Türkçe kullanıcı arayüzü
- [x] Responsive tasarım
- [x] Loading states
- [x] Error handling
- [x] Sparkline grafikleri (mini 7d grafikler)

## 📱 Ekran Görüntüleri

### Dashboard
- Top 100 cryptocurrency listesi
- Gerçek zamanlı fiyatlar ve değişimler
- Arama ve sıralama

### Coin Detail
- Detaylı coin bilgileri
- İnteraktif fiyat grafikleri
- ATH/ATL istatistikleri

### Portfolio
- Yatırım takibi
- Kar/zarar hesaplaması
- Dağılım grafiği

### Favorites
- Hızlı erişim
- Mini grafikler
- İstatistikler

## 🐛 Bilinen Sorunlar ve Çözümler

### CoinGecko API Rate Limiting
**Sorun**: Free tier'da 10-50 request/minute limit  
**Çözüm**: 
- 2 saniye arası minimum bekleme
- 5 dakikalık cache sistemi
- Otomatik retry mekanizması

### CORS Hataları
**Çözüm**: Direkt CoinGecko API kullanımı (proxy gerekmez)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License - detaylar için LICENSE dosyasına bakın.

## 👨‍💻 Geliştirici

**Ufuk Seker**

- 📧 Email: sekerufuk246@gmail.com
- 💼 LinkedIn: [\[profil linki\]](https://tr.linkedin.com/in/ufuk-%C5%9Feker-82a5222b5)
- 🐙 GitHub: [@ufukseker](https://github.com/UfukSeker41)

## 🙏 Teşekkürler

- [CoinGecko](https://www.coingecko.com/) - Ücretsiz API
- [Chart.js](https://www.chartjs.org/) - Grafik kütüphanesi
- [React Icons](https://react-icons.github.io/react-icons/) - Icon kütüphanesi

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!

📚 Detaylı kullanım için [KULLANIM_KLAVUZU.md](./KULLANIM_KLAVUZU.md) dosyasına bakın.

---

Made with ❤️ by Ufuk Seker | October 2025
