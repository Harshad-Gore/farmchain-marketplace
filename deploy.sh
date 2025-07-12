#!/bin/bash

# FarmChain Marketplace Deployment Script

echo "🚀 Starting FarmChain Marketplace deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your actual configuration values"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads
mkdir -p logs

# Set proper permissions
echo "🔒 Setting proper permissions..."
chmod -R 755 public/
chmod -R 755 uploads/
chmod -R 755 logs/

# Run database migrations (if needed)
echo "🗃️  Setting up database..."
# Add database setup commands here if using a real database

echo "✅ Deployment completed successfully!"
echo ""
echo "🎉 FarmChain Marketplace is ready to run!"
echo ""
echo "To start the server:"
echo "  npm start           # Production mode"
echo "  npm run dev         # Development mode with auto-reload"
echo ""
echo "The application will be available at:"
echo "  http://localhost:3000"
echo ""
echo "📝 Don't forget to:"
echo "  1. Update your .env file with actual configuration values"
echo "  2. Configure your Web3 provider (MetaMask, etc.)"
echo "  3. Set up your blockchain network settings"
echo "  4. Configure your database connection"
echo ""
echo "Happy farming! 🌱"
