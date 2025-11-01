# CryptoVault - Professional Crypto Dashboard

A modern, dark-themed cryptocurrency dashboard built with React, TypeScript, and Node.js. Track real-time market data, manage your portfolio, set price alerts, and stay updated with crypto news.

![CryptoVault Dashboard](https://img.shields.io/badge/React-18.0.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green) ![Material-UI](https://img.shields.io/badge/Material--UI-5.0.0-purple)

## ✨ Features

### 📊 **Market Overview**
- Real-time cryptocurrency prices and market data
- Top 50 cryptocurrencies by market cap
- Interactive price charts with multiple timeframes (7d, 30d, 90d, 1y)
- Market cap, volume, and price change statistics
- Search and filter functionality

### 🪙 **Coin Details**
- Comprehensive coin information pages
- Historical price charts with customizable time periods
- Key statistics (supply, ATH, ATL, rank)
- Links to official sites, blockchain explorers, and social media
- Coin-specific news and updates

### 💼 **Portfolio Management**
- Track your cryptocurrency investments
- Add/remove coins from your portfolio
- View total portfolio value and P&L
- Best performer tracking
- Detailed holdings table

### ⭐ **Watchlist**
- Save your favorite cryptocurrencies
- Quick access to important coins
- Watchlist statistics and overview
- Persistent storage using localStorage

### 📰 **News Section**
- Latest cryptocurrency news and updates
- Category filtering (Crypto, Bitcoin, Ethereum, etc.)
- Real-time news from CryptoCompare API
- Responsive news grid layout

### 🔔 **Price Alerts**
- Set custom price alerts for any cryptocurrency
- Toggle alerts on/off
- Delete unwanted alerts
- Persistent alert storage

### 🎨 **Modern UI/UX**
- Dark theme with glassmorphism effects
- Responsive design for all devices
- Sidebar navigation
- Loading states and error handling
- Beautiful charts and visualizations

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **Chart.js & react-chartjs-2** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation
- **Inter Font** - Typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB & Mongoose** - Database
- **Axios** - External API calls

### APIs
- **CoinGecko API** - Cryptocurrency data
- **CryptoCompare API** - News and additional data

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (optional, for portfolio features)

### 1. Clone the Repository
```bash
git clone https://github.com/MelakuAzene21/Crypto-Dashboard
cd crypto-dashboard
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm start
```
Application will open on `http://localhost:3000`

## 📱 Usage

### Dashboard
- View market overview and key metrics
- See trending cryptocurrencies
- Quick access to all features

### Markets
- Browse all available cryptocurrencies
- Search and filter coins
- Add coins to your watchlist
- View detailed market information

### Portfolio
- Add coins to your portfolio with quantity and buy price
- Track total value and profit/loss
- View best performing assets
- Manage your investments

### Watchlist
- Save your favorite cryptocurrencies
- Quick access to important coins
- Monitor specific coins easily

### News
- Stay updated with latest crypto news
- Filter by categories
- Read detailed articles

### Alerts
- Set price alerts for any cryptocurrency
- Get notified when prices reach your targets
- Manage and organize your alerts

## 🔧 API Endpoints

### Coins
- `GET /api/coins` - Get top cryptocurrencies
- `GET /api/coin/:id` - Get coin details
- `GET /api/coin/:id/history` - Get price history
- `GET /api/coin/:id/news` - Get coin-specific news

### Portfolio
- `GET /api/portfolio` - Get user portfolio
- `POST /api/portfolio` - Add to portfolio

### News
- `GET /api/news` - Get general crypto news

## 🎨 Customization

### Theme
The application uses a custom dark theme with glassmorphism effects. You can modify the theme in `frontend/src/App.tsx`.

### Styling
- Material-UI components with custom styling
- Responsive design for mobile and desktop
- Dark theme with blue accent colors

## 📊 Data Sources

- **CoinGecko API**: Real-time cryptocurrency data, prices, and market information
- **CryptoCompare API**: News articles and additional market data

## 🔒 Security Notes

- API keys are stored in environment variables
- CORS is enabled for development
- Input validation on all forms
- Error handling for API failures

## 🚀 Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

Deploy the `build` folder to your hosting service.

## 🤝 if you want Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify your environment variables
4. Check API rate limits

## 🔮 Future Enhancements

- User authentication and accounts
- Advanced portfolio analytics
- Price prediction features
- Mobile app version
- More chart indicators
- Social features and sharing
- Advanced alert conditions

---

**Built with ❤️ for the crypto community**
