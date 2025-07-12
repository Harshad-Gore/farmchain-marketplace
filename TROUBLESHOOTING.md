# 🔧 FarmChain Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. MIME Type Errors (CSS/JS not loading)

**Problem:** 
```
Refused to apply style from 'http://localhost:3000/css/custom.css' because its MIME type ('application/json') is not a supported stylesheet MIME type
```

**Solution:**
✅ **Fixed!** The file paths have been corrected in `index.html`:
- Changed from `/css/custom.css` to `css/custom.css`
- Changed from `/js/app.js` to `js/app.js`

### 2. 404 File Not Found Errors

**Problem:**
```
GET http://localhost:3000/js/app.js net::ERR_ABORTED 404 (Not Found)
```

**Solution:**
✅ **Fixed!** The Express server now properly serves static files from the `public` directory with correct MIME types.

### 3. MetaMask Not Installed

**Problem:**
```
MetaMask is not installed. Please install it to use Web3 features.
```

**Solution:**
1. **Install MetaMask browser extension:**
   - Go to https://metamask.io/
   - Click "Download" and install for your browser
   - Create a new wallet or import existing one

2. **Get Test ETH (for testing):**
   - Use Goerli testnet faucet: https://goerlifaucet.com/
   - Or Sepolia testnet faucet: https://sepoliafaucet.com/

### 4. Server Not Starting

**Problem:**
Server won't start or crashes immediately.

**Solution:**
1. **Check Node.js installation:**
   ```cmd
   node --version
   npm --version
   ```

2. **Install dependencies:**
   ```cmd
   npm install
   ```

3. **Check port availability:**
   - Default port is 3000
   - If occupied, change in `.env` file or `server.js`

### 5. Files Not Loading

**Problem:**
CSS styles don't apply, JavaScript doesn't work.

**Solution:**
1. **Use the correct startup method:**
   ```cmd
   start.bat
   ```

2. **Test file loading:**
   - Visit: http://localhost:3000/test.html
   - Should show styled content and success message

## 🚀 Step-by-Step Setup

### Method 1: Quick Start (Recommended)
```cmd
# Double-click or run in Command Prompt
start.bat
```

### Method 2: Manual Start
```cmd
# Install dependencies
npm install

# Start server
node server.js
```

### Method 3: Development Mode
```cmd
# Start with auto-reload
npm run dev
```

## 🦊 MetaMask Setup Guide

1. **Install MetaMask:**
   - Go to https://metamask.io/
   - Install browser extension
   - Create/import wallet

2. **Configure Network:**
   - Click MetaMask icon
   - Select "Ethereum Mainnet" dropdown
   - Add "Goerli Test Network" or "Sepolia Test Network"

3. **Get Test ETH:**
   - Visit faucet websites
   - Enter your wallet address
   - Receive free test ETH

4. **Connect to FarmChain:**
   - Visit http://localhost:3000
   - Click "Connect Web3"
   - Approve connection in MetaMask

## 🔍 Testing Your Setup

### 1. Basic Server Test
- Visit: http://localhost:3000
- Should see FarmChain homepage

### 2. Static Files Test
- Visit: http://localhost:3000/test.html
- Should see styled content and success message

### 3. Web3 Integration Test
- Install MetaMask
- Connect wallet
- Try to purchase a product

### 4. API Test
- Visit: http://localhost:3000/api/products
- Should see JSON response with products

## 🐛 Debug Mode

### Enable Debug Logging
Add to your environment or run with:
```cmd
set DEBUG=farmchain:*
node server.js
```

### Check Browser Console
- Press F12
- Go to Console tab
- Look for error messages

### Check Network Tab
- Press F12
- Go to Network tab
- Check if files are loading (green status)

## 📋 Checklist

Before running the marketplace:

- [ ] Node.js installed (v14 or higher)
- [ ] Dependencies installed (`npm install`)
- [ ] MetaMask browser extension installed
- [ ] Test ETH in wallet (for testing)
- [ ] Server started without errors
- [ ] Can access http://localhost:3000
- [ ] CSS and JS files loading correctly
- [ ] Web3 connection working

## 🆘 Still Having Issues?

### Check File Structure
Your project should look like:
```
CodeClash/
├── public/
│   ├── css/
│   │   └── custom.css
│   └── js/
│       ├── app.js
│       └── web3-contract.js
├── server.js
├── index.html
├── package.json
└── start.bat
```

### Common Fixes
1. **Restart server** after making changes
2. **Clear browser cache** (Ctrl+Shift+R)
3. **Check firewall** isn't blocking port 3000
4. **Update MetaMask** to latest version
5. **Try different browser** (Chrome works best)

### Emergency Reset
If everything is broken:
```cmd
# Delete node_modules and reinstall
rmdir /s node_modules
npm install

# Restart server
node server.js
```

## 📞 Support

If you're still having issues:
1. Check the browser console for error messages
2. Check the server console for error messages
3. Try the test page: http://localhost:3000/test.html
4. Make sure MetaMask is installed and unlocked

## 🎯 Success Indicators

✅ **Everything is working when:**
- Server starts without errors
- Homepage loads with proper styling
- JavaScript functions work (product filtering, etc.)
- MetaMask connects successfully
- Can view products and farmer profiles
- No console errors in browser

Your FarmChain marketplace should now be fully functional! 🌱🚀
