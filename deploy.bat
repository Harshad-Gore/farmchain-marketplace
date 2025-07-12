@echo off
REM FarmChain Marketplace Deployment Script for Windows

echo 🚀 Starting FarmChain Marketplace deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Create .env file from example if it doesn't exist
if not exist .env (
    echo 📄 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please update the .env file with your actual configuration values
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist uploads mkdir uploads
if not exist logs mkdir logs

echo ✅ Deployment completed successfully!
echo.
echo 🎉 FarmChain Marketplace is ready to run!
echo.
echo To start the server:
echo   npm start           # Production mode
echo   npm run dev         # Development mode with auto-reload
echo.
echo The application will be available at:
echo   http://localhost:3000
echo.
echo 📝 Don't forget to:
echo   1. Update your .env file with actual configuration values
echo   2. Configure your Web3 provider (MetaMask, etc.)
echo   3. Set up your blockchain network settings
echo   4. Configure your database connection
echo.
echo Happy farming! 🌱
pause
