@echo off
echo 🚀 Starting FarmChain Marketplace...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo ✅ Dependencies are ready

REM Start the server
echo 🌐 Starting server on port 3000...
echo.
echo 🌟 FarmChain Marketplace will be available at:
echo 📍 http://localhost:3000
echo.
echo 🔧 To test file loading, visit:
echo 📍 http://localhost:3000/test.html
echo.
echo 🦊 Don't forget to install MetaMask browser extension!
echo 📥 Download from: https://metamask.io/
echo.
echo 📝 Press Ctrl+C to stop the server
echo.

node server.js
