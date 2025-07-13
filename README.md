# 🌱 FarmChain - Web3 Farmer-to-Consumer Marketplace

A revolutionary blockchain-based marketplace connecting farmers directly with consumers, ensuring transparency, authenticity, and fair trade in the agricultural sector.

## ✨ Features

### 🚀 Core Features
- **Direct Farm-to-Consumer Connection**: Eliminate middlemen and connect directly with farmers
- **Blockchain Verification**: Every product is verified on the blockchain for authenticity
- **Smart Contract Integration**: Secure, transparent transactions using Ethereum smart contracts
- **Real-time Web3 Integration**: MetaMask wallet connection and transaction processing
- **Product Traceability**: Complete product history from farm to table
- **Farmer Verification System**: Verified farmer badges and profiles

### 🎨 UI/UX Features
- **Modern, Professional Design**: Clean, subtle styling with Bootstrap and Tailwind CSS
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Product Catalog**: Filter by category, search, and browse products
- **Real-time Notifications**: Toast notifications for all user actions
- **Shopping Cart**: Add products to cart and checkout with crypto payments
- **Farmer Profiles**: Detailed farmer information and specialties

### 🔧 Technical Features
- **Node.js Backend**: Express.js server with RESTful API
- **Web3 Integration**: Ethereum blockchain integration with Web3.js
- **Security**: Helmet, CORS, rate limiting, and JWT authentication
- **File Upload**: Multer for image uploads and IPFS integration
- **Database Ready**: MongoDB integration with Mongoose ODM
- **Environment Configuration**: Comprehensive .env setup for all environments

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with modern features
- **Bootstrap 5** - Responsive component framework
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features
- **Web3.js** - Ethereum blockchain interaction
- **Font Awesome** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database (optional, in-memory storage for demo)
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - DDoS protection

### Blockchain
- **Ethereum** - Smart contract platform
- **Solidity** - Smart contract language
- **Web3.js** - Blockchain interaction
- **MetaMask** - Wallet integration
- **IPFS** - Decentralized file storage

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- MetaMask browser extension

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harshad-Gore/farmchain-marketplace.git
   cd farmchain-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

### Windows Quick Setup
Run the deployment script:
```cmd
deploy.bat
```

### Linux/Mac Quick Setup
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🚀 Usage

### For Consumers
1. **Connect Wallet**: Click "Connect Web3" to connect your MetaMask wallet
2. **Browse Products**: Explore fresh products from verified farmers
3. **Filter & Search**: Use category filters and search to find specific products
4. **Add to Cart**: Add desired products to your shopping cart
5. **Checkout**: Complete purchase using cryptocurrency (ETH)
6. **Track Orders**: View transaction history and product traceability

### For Farmers
1. **Register**: Create a farmer profile with verification
2. **Add Products**: List your products with descriptions and prices
3. **Manage Inventory**: Update product quantities and availability
4. **Receive Payments**: Get paid directly in cryptocurrency
5. **Build Reputation**: Earn ratings and reviews from customers

### Web3 Integration
- **MetaMask Required**: Users need MetaMask for Web3 functionality
- **Ethereum Network**: Configure for Mainnet, Goerli, or local testnet
- **Smart Contracts**: Automated payment processing and product verification
- **Gas Fees**: Users pay network fees for blockchain transactions

## 🔧 Configuration

### Environment Variables
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/farmchain

# JWT
JWT_SECRET=your-secret-key

# Web3
INFURA_PROJECT_ID=your-infura-id
ETHEREUM_NETWORK=goerli
CONTRACT_ADDRESS=0x...

# IPFS
IPFS_GATEWAY=https://ipfs.infura.io:5001
```

### Smart Contract Deployment
1. **Install Hardhat**
   ```bash
   npm install --save-dev hardhat
   ```

2. **Compile Contracts**
   ```bash
   npx hardhat compile
   ```

3. **Deploy to Network**
   ```bash
   npx hardhat run scripts/deploy.js --network goerli
   ```

## 📁 Project Structure

```
farmchain-marketplace/
├── public/                 # Static files
│   ├── css/               # Custom stylesheets
│   ├── js/                # JavaScript files
│   └── images/            # Static images
├── uploads/               # File uploads
├── logs/                  # Application logs
├── contracts/             # Smart contracts (if using Hardhat)
├── scripts/               # Deployment scripts
├── tests/                 # Test files
├── .env.example           # Environment template
├── .gitignore            # Git ignore file
├── package.json          # Dependencies
├── server.js             # Main server file
├── index.html            # Main HTML file
└── README.md             # This file
```

## 🔐 Security Features

- **Helmet**: Security headers protection
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: DDoS protection
- **JWT Authentication**: Secure user sessions
- **Input Validation**: Sanitized user inputs
- **Smart Contract Security**: Audited contract code
- **HTTPS Support**: SSL/TLS encryption ready

## 🌐 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create new product (farmers only)
- `PUT /api/products/:id` - Update product (farmers only)
- `DELETE /api/products/:id` - Delete product (farmers only)

### Farmers
- `GET /api/farmers` - Get all farmers
- `GET /api/farmers/:id` - Get specific farmer
- `POST /api/farmers` - Register new farmer
- `PUT /api/farmers/:id` - Update farmer profile

### Transactions
- `POST /api/verify-transaction` - Verify blockchain transaction
- `GET /api/transactions/:hash` - Get transaction details
- `GET /api/user/:address/transactions` - Get user transaction history

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- --grep "Product API"

# Run tests with coverage
npm run test:coverage
```

### Test Smart Contracts
```bash
# Test with Hardhat
npx hardhat test

# Test with specific network
npx hardhat test --network localhost
```

## 📊 Performance

- **Lightweight**: Minimal dependencies for fast loading
- **Optimized Images**: WebP format with fallbacks
- **Caching**: Browser caching for static assets
- **Compression**: Gzip compression enabled
- **CDN Ready**: Static assets can be served from CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs on GitHub Issues
- **Email**: Contact the development team
- **Community**: Join our Discord server

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic marketplace functionality
- ✅ Web3 integration
- ✅ Product catalog
- ✅ Farmer profiles

### Phase 2 (Next)
- 🔄 Smart contract deployment
- 🔄 IPFS integration
- 🔄 Advanced search filters
- 🔄 Mobile app development

### Phase 3 (Future)
- 📋 Multi-language support
- 📋 Advanced analytics
- 📋 AI-powered recommendations
- 📋 Supply chain tracking

## 🎯 Demo

**Live Demo**: [https://farmchain-demo.herokuapp.com](https://farmchain-demo.herokuapp.com)

**Test Credentials**:
- Consumer: Connect with MetaMask
- Farmer: Use demo farmer accounts

## 📞 Contact

- **Discord**: ```raybyte```
- **GitHub**: [@Harshad-Gore](https://github.com/Harshad-Gore)

---

**Built with ❤️ for sustainable agriculture and blockchain technology**
