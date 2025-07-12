// Web3 Farmer-to-Consumer Marketplace
class FarmChainApp {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.products = [];
        this.farmers = [];
        this.cart = [];
        this.init();
    }

    async init() {
        // Update status indicator
        this.updateAppStatus('Initializing...');
        
        await this.loadProducts();
        await this.loadFarmers();
        this.setupEventListeners();
        this.renderProducts();
        this.renderFarmers();
        this.updateCartDisplay();
        this.initializeModals();
        this.checkExistingConnection();
        
        // Update status to ready
        this.updateAppStatus('Ready');
        
        // Show welcome notification
        setTimeout(() => {
            this.showNotification('Welcome to FarmChain! 🌾 Connect your wallet or use temporary session for cart functionality.', 'info');
        }, 2000);
    }

    updateAppStatus(status) {
        const statusElement = document.getElementById('appStatus');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `badge bg-${status === 'Ready' ? 'success' : status === 'Error' ? 'danger' : 'warning'}`;
        }
    }

    initializeModals() {
        // Initialize cart modal functionality
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.addEventListener('show.bs.modal', () => {
                this.renderCartItems();
            });
        }
    }

    // Check for existing MetaMask connection
    async checkExistingConnection() {
        console.log('🔍 Checking for existing MetaMask connection...');
        
        // Wait a bit for MetaMask to fully initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            if (typeof window.ethereum !== 'undefined') {
                console.log('✅ MetaMask is installed!');
                
                // Check if already connected (this method doesn't trigger connection popup)
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    this.web3 = new Web3(window.ethereum);
                    this.account = accounts[0];
                    this.updateWalletStatus(true);
                    this.loadCart();
                    console.log('✅ Already connected to:', this.account);
                } else {
                    console.log('📱 MetaMask found but no accounts connected. Click "Connect Web3" to connect.');
                }
            } else {
                console.log('❌ MetaMask not found');
            }
        } catch (error) {
            console.log('❌ Error checking existing connection:', error.message);
        }
    }

    // Web3 Integration
    async connectWallet() {
        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask is not installed. Please install MetaMask browser extension from https://metamask.io/');
            }

            console.log('🔗 Connecting to MetaMask...');
            
            this.web3 = new Web3(window.ethereum);
            
            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length === 0) {
                throw new Error('No accounts found. Please make sure MetaMask is unlocked.');
            }
            
            this.account = accounts[0];
            console.log('✅ Connected to account:', this.account);
            
            this.updateWalletStatus(true);
            this.showNotification('Wallet connected successfully!', 'success');
            
            // Load user's cart when wallet is connected
            this.loadCart();
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnectWallet();
                } else {
                    this.account = accounts[0];
                    this.updateWalletStatus(true);
                    this.loadCart();
                    this.showNotification('Account changed', 'info');
                }
            });
            
            // Listen for chain changes
            window.ethereum.on('chainChanged', (chainId) => {
                console.log('Chain changed to:', chainId);
                this.showNotification('Network changed. Please refresh the page.', 'info');
                window.location.reload();
            });
            
        } catch (error) {
            console.error('Error connecting wallet:', error);
            
            // Handle specific error types
            if (error.code === 4001) {
                this.showNotification('MetaMask connection was rejected by user', 'error');
            } else if (error.code === -32002) {
                this.showNotification('MetaMask connection request is already pending', 'info');
            } else {
                this.showNotification(error.message || 'Failed to connect wallet', 'error');
            }
        }
    }

    disconnectWallet() {
        this.web3 = null;
        this.account = null;
        this.cart = [];
        this.updateWalletStatus(false);
        this.showNotification('Wallet disconnected', 'info');
    }

    updateWalletStatus(connected) {
        const statusElement = document.getElementById('walletStatus');
        const connectButton = document.getElementById('connectWallet');
        
        if (connected) {
            statusElement.innerHTML = `<i class="fas fa-wallet me-2"></i>${this.account.substring(0, 6)}...${this.account.substring(38)}`;
            statusElement.className = 'web3-status connected';
            connectButton.innerHTML = '<i class="fas fa-sign-out-alt me-2"></i>Disconnect';
            connectButton.onclick = () => this.disconnectWallet();
            
            // Load user's cart when wallet is connected
            this.loadCart();
            
            // Check if user is already a registered farmer
            this.checkIfFarmerExists();
        } else {
            statusElement.innerHTML = '<i class="fas fa-wallet me-2"></i>Connect Wallet';
            statusElement.className = 'web3-status disconnected';
            connectButton.innerHTML = '<i class="fas fa-plug me-2"></i>Connect Web3';
            connectButton.onclick = () => this.connectWallet();
            
            // Clear cart when wallet is disconnected
            this.cart = [];
            this.updateCartDisplay();
        }
    }

    // Load user's cart from server
    async loadCart() {
        if (!this.account) return;

        try {
            const response = await fetch(`/api/cart/${this.account}`);
            const result = await response.json();

            if (result.success) {
                this.cart = result.cart;
                this.updateCartDisplay();
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }

    // API Integration
    async loadProducts() {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            if (data.success) {
                this.products = data.products;
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.showNotification('Failed to load products', 'error');
        }
    }

    async loadFarmers() {
        try {
            const response = await fetch('/api/farmers');
            const data = await response.json();
            if (data.success) {
                this.farmers = data.farmers;
            }
        } catch (error) {
            console.error('Error loading farmers:', error);
            this.showNotification('Failed to load farmers', 'error');
        }
    }

    // UI Rendering
    renderProducts(filteredProducts = null) {
        const productsGrid = document.getElementById('productsGrid');
        const products = filteredProducts || this.products;
        
        productsGrid.innerHTML = products.map(product => `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card product-card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold">${product.name}</h5>
                            ${product.verified ? '<i class="fas fa-check-circle text-success" title="Verified"></i>' : ''}
                        </div>
                        <p class="card-text text-muted small mb-2">${product.description}</p>
                        <div class="mb-2">
                            <span class="farmer-badge">${product.farmer}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="price-tag">${product.price} (${product.priceETH} ETH)</span>
                            <small class="text-muted">${product.quantity} ${product.unit}</small>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="text-warning">
                                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
                                <small class="text-muted">(${product.reviews})</small>
                            </div>
                            <small class="text-muted">${product.location}</small>
                        </div>
                        <div class="mt-auto">
                            <button class="btn btn-primary-custom w-100 mb-2" onclick="app.addToCart(${product.id})">
                                <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                            </button>
                            <button class="btn btn-outline-primary w-100" onclick="app.buyNow(${product.id})">
                                <i class="fas fa-bolt me-2"></i>Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderFarmers() {
        const farmersGrid = document.getElementById('farmersGrid');
        
        farmersGrid.innerHTML = this.farmers.map(farmer => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body text-center">
                        <img src="${farmer.image}" class="rounded-circle mb-3" alt="${farmer.name}" style="width: 100px; height: 100px; object-fit: cover; align-self:middle;">
                        <h5 class="card-title fw-bold">${farmer.name}</h5>
                        <p class="text-muted mb-2">${farmer.location}</p>
                        <div class="mb-3">
                            ${farmer.specialties.map(specialty => `<span class="badge bg-success me-1">${specialty}</span>`).join('')}
                        </div>
                        <div class="d-flex justify-content-around text-center mb-3">
                            <div>
                                <h6 class="fw-bold text-primary">${farmer.experience}</h6>
                                <small class="text-muted">Experience</small>
                            </div>
                            <div>
                                <h6 class="fw-bold text-warning">${farmer.rating}</h6>
                                <small class="text-muted">Rating</small>
                            </div>
                            <div>
                                <h6 class="fw-bold text-success">${farmer.totalProducts}</h6>
                                <small class="text-muted">Products</small>
                            </div>
                        </div>
                        <p class="text-muted small">${farmer.bio}</p>
                        <div class="mt-auto">
                            <button class="btn btn-outline-primary btn-sm" onclick="app.viewFarmerProducts('${farmer.name}')">
                                <i class="fas fa-eye me-1"></i>View Products
                            </button>
                            ${farmer.verified ? '<i class="fas fa-shield-alt text-success ms-2" title="Verified Farmer"></i>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Cart Management
    async addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            this.showNotification('Product not found', 'error');
            return;
        }

        // For testing purposes, if no account is connected, use a temporary address
        let userAddress = this.account;
        if (!userAddress) {
            userAddress = 'temp_user_' + Math.random().toString(36).substr(2, 9);
            this.account = userAddress;
            this.showNotification('Using temporary session for cart (Connect wallet for persistent cart)', 'info');
        }

        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAddress: userAddress,
                    productId: productId,
                    quantity: 1
                })
            });

            const result = await response.json();

            if (result.success) {
                this.cart = result.cart;
                this.updateCartDisplay();
                this.showNotification(`${product.name} added to cart`, 'success');
            } else {
                this.showNotification(result.message || 'Error adding to cart', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Error adding to cart', 'error');
        }
    }

    async removeFromCart(productId) {
        let userAddress = this.account;
        if (!userAddress) {
            this.showNotification('No active cart session', 'error');
            return;
        }

        try {
            const response = await fetch('/api/cart/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAddress: userAddress,
                    productId: productId
                })
            });

            const result = await response.json();

            if (result.success) {
                this.cart = result.cart;
                this.updateCartDisplay();
                this.showNotification('Item removed from cart', 'info');
            } else {
                this.showNotification(result.message || 'Error removing from cart', 'error');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            this.showNotification('Error removing from cart', 'error');
        }
    }

    updateCartDisplay() {
        const cartItems = this.cart.length;
        const cartTotal = this.cart.reduce((sum, item) => sum + (parseFloat(item.product.price.replace('₹', '')) * item.quantity), 0);
        const cartTotalETH = this.cart.reduce((sum, item) => sum + (parseFloat(item.product.priceETH) * item.quantity), 0);
        
        const cartButtons = document.querySelectorAll('.cart-button');
        cartButtons.forEach(button => {
            button.innerHTML = `<i class="fas fa-shopping-cart me-2"></i>Cart (${cartItems})`;
        });
        
        // Update cart modal
        this.renderCartItems();
        
        const cartTotalElement = document.getElementById('cartTotal');
        const cartTotalETHElement = document.getElementById('cartTotalETH');
        
        if (cartTotalElement) {
            cartTotalElement.textContent = `₹${cartTotal.toFixed(2)}`;
        }
        if (cartTotalETHElement) {
            cartTotalETHElement.textContent = `${cartTotalETH.toFixed(6)}`;
        }
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        
        if (!cartItemsContainer) return;
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }
        
        if (emptyCart) emptyCart.style.display = 'none';
        
        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item border-bottom pb-3 mb-3">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.product.image}" alt="${item.product.name}" class="img-fluid rounded" style="height: 60px; width: 60px; object-fit: cover;">
                    </div>
                    <div class="col-md-6">
                        <h6 class="mb-1">${item.product.name}</h6>
                        <small class="text-muted">${item.product.farmer} - ${item.product.location}</small>
                        <div class="text-primary fw-bold">${item.product.price} (${item.product.priceETH} ETH)</div>
                    </div>
                    <div class="col-md-2">
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary" onclick="app.updateCartQuantity(${item.productId}, -1)">-</button>
                            <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                            <button class="btn btn-outline-secondary" onclick="app.updateCartQuantity(${item.productId}, 1)">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 text-center">
                        <button class="btn btn-outline-danger btn-sm" onclick="app.removeFromCart(${item.productId})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async updateCartQuantity(productId, change) {
        let userAddress = this.account;
        if (!userAddress) {
            this.showNotification('No active cart session', 'error');
            return;
        }

        const item = this.cart.find(item => item.productId === productId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        try {
            const response = await fetch('/api/cart/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAddress: userAddress,
                    productId: productId,
                    quantity: newQuantity
                })
            });

            const result = await response.json();

            if (result.success) {
                this.cart = result.cart;
                this.updateCartDisplay();
            } else {
                this.showNotification(result.message || 'Error updating cart', 'error');
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            this.showNotification('Error updating cart', 'error');
        }
    }

    async clearCart() {
        let userAddress = this.account;
        if (!userAddress) {
            this.showNotification('No active cart session', 'error');
            return;
        }

        try {
            const response = await fetch('/api/cart/clear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAddress: userAddress
                })
            });

            const result = await response.json();

            if (result.success) {
                this.cart = [];
                this.updateCartDisplay();
                this.showNotification('Cart cleared', 'info');
            } else {
                this.showNotification(result.message || 'Error clearing cart', 'error');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            this.showNotification('Error clearing cart', 'error');
        }
    }

    async checkoutCart() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        let userAddress = this.account;
        if (!userAddress) {
            this.showNotification('No active cart session', 'error');
            return;
        }

        try {
            const totalETH = this.cart.reduce((sum, item) => sum + (parseFloat(item.product.priceETH) * item.quantity), 0);
            const totalINR = this.cart.reduce((sum, item) => sum + (parseFloat(item.product.price.replace('₹', '')) * item.quantity), 0);
            
            this.showNotification('Processing checkout...', 'info');
            
            // If Web3 is connected, simulate blockchain transaction
            if (this.web3) {
                const priceInWei = this.web3.utils.toWei(totalETH.toString(), 'ether');
                const txHash = '0x' + Math.random().toString(16).substr(2, 64);
                this.showNotification(`Checkout successful! Transaction: ${txHash.substring(0, 10)}... (Total: ₹${totalINR.toFixed(2)} / ${totalETH.toFixed(6)} ETH)`, 'success');
            } else {
                // Traditional checkout without blockchain
                const orderId = 'ORD-' + Date.now();
                this.showNotification(`Checkout successful! Order ID: ${orderId} (Total: ₹${totalINR.toFixed(2)})`, 'success');
            }
            
            // Clear cart after successful checkout
            this.clearCart();
            
            // Close modal
            const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            if (cartModal) {
                cartModal.hide();
            }
            
        } catch (error) {
            console.error('Checkout error:', error);
            this.showNotification('Checkout failed. Please try again.', 'error');
        }
    }

    // Farmer Registration
    async registerFarmer() {
        const farmerData = {
            name: document.getElementById('farmerName').value,
            location: document.getElementById('farmerLocation').value,
            bio: document.getElementById('farmerBio').value,
            specialty: document.getElementById('farmerSpecialty').value,
            experience: document.getElementById('farmerExperience').value,
            farmSize: document.getElementById('farmerFarmSize').value,
            walletAddress: this.account
        };
        
        // Validate form
        if (!farmerData.name || !farmerData.location || !farmerData.specialty || !farmerData.experience || !farmerData.farmSize) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!document.getElementById('farmerTerms').checked) {
            this.showNotification('Please accept the terms and conditions', 'error');
            return;
        }
        
        try {
            this.showNotification('Registering farmer...', 'info');
            
            const response = await fetch('/api/register-farmer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(farmerData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Farmer registered successfully!', 'success');
                
                // Add to local farmers array
                this.farmers.push(result.farmer);
                this.renderFarmers();
                
                // Show product form
                document.getElementById('productFormContainer').style.display = 'none';
                document.getElementById('addProductForm').style.display = 'block';
                
                // Store farmer ID for product creation
                this.currentFarmerId = result.farmer.id;
                this.currentFarmerAddress = result.farmer.address;
                
                // Reset farmer form
                document.getElementById('farmerRegistrationForm').reset();
                
                this.showNotification('You can now add your products!', 'info');
                
            } else {
                this.showNotification(result.message || 'Registration failed', 'error');
            }
            
        } catch (error) {
            console.error('Error registering farmer:', error);
            this.showNotification('Registration failed. Please try again.', 'error');
        }
    }

    // Enable product form for existing farmers
    enableProductForm() {
        const productFormContainer = document.getElementById('productFormContainer');
        const addProductForm = document.getElementById('addProductForm');
        
        if (productFormContainer && addProductForm) {
            productFormContainer.style.display = 'none';
            addProductForm.style.display = 'block';
            
            // If user has an account, set it as farmer address
            if (this.account) {
                this.currentFarmerAddress = this.account;
            }
            
            this.showNotification('Product form enabled! You can now add products.', 'success');
        }
    }

    // Check if current user is already a registered farmer
    checkIfFarmerExists() {
        if (this.account) {
            const existingFarmer = this.farmers.find(f => f.address === this.account);
            if (existingFarmer) {
                this.currentFarmerId = existingFarmer.id;
                this.currentFarmerAddress = existingFarmer.address;
                this.enableProductForm();
                this.showNotification(`Welcome back, ${existingFarmer.name}! You can add products.`, 'info');
                return true;
            }
        }
        return false;
    }

    // Add Product
    async addProduct() {
        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            price: document.getElementById('productPrice').value,
            quantity: document.getElementById('productQuantity').value,
            unit: document.getElementById('productUnit').value,
            image: document.getElementById('productImage').value || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
            farmerAddress: this.currentFarmerAddress || this.account
        };
        
        // Validate form
        if (!productData.name || !productData.category || !productData.description || !productData.price || !productData.quantity || !productData.unit) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!productData.farmerAddress) {
            this.showNotification('Please register as a farmer first', 'error');
            return;
        }
        
        try {
            this.showNotification('Adding product...', 'info');
            
            // Add INR prefix and calculate ETH price
            if (!productData.price.includes('₹')) {
                productData.price = `₹${productData.price}`;
            }
            productData.priceETH = (parseFloat(productData.price.replace('₹', '')) * 0.000012).toFixed(6);
            
            const response = await fetch('/api/create-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Product added successfully!', 'success');
                
                // Add to local products array
                this.products.push(result.product);
                this.renderProducts();
                
                // Reset product form
                document.getElementById('addProductForm').reset();
                
                // Ask if they want to add another product
                setTimeout(() => {
                    if (confirm('Product added successfully! Would you like to add another product?')) {
                        // Keep the modal open for another product
                        return;
                    } else {
                        // Close modal
                        const farmerModal = bootstrap.Modal.getInstance(document.getElementById('becomeFarmerModal'));
                        if (farmerModal) {
                            farmerModal.hide();
                        }
                    }
                }, 1000);
                
            } else {
                this.showNotification(result.message || 'Failed to add product', 'error');
            }
            
        } catch (error) {
            console.error('Error adding product:', error);
            this.showNotification('Failed to add product. Please try again.', 'error');
        }
    }

    // Web3 Purchase
    async buyNow(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            this.showNotification('Product not found', 'error');
            return;
        }

        if (!this.account) {
            this.showNotification('Please connect your wallet first', 'error');
            return;
        }

        try {
            // Show loading
            this.showNotification('Processing transaction...', 'info');
            
            // Convert ETH to Wei
            const priceInWei = this.web3.utils.toWei(product.price, 'ether');
            
            // Create transaction
            const transaction = {
                from: this.account,
                to: product.farmerAddress,
                value: priceInWei,
                gas: 21000,
                gasPrice: await this.web3.eth.getGasPrice()
            };

            // Send transaction
            const txHash = await this.web3.eth.sendTransaction(transaction);
            
            // Verify transaction with backend
            const verificationResponse = await fetch('/api/verify-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionHash: txHash.transactionHash,
                    productId: product.id,
                    buyerAddress: this.account,
                    amount: product.price
                })
            });

            const verificationData = await verificationResponse.json();
            
            if (verificationData.success) {
                this.showNotification('Purchase successful! Transaction verified.', 'success');
                // Reload products to update quantities
                await this.loadProducts();
                this.renderProducts();
            } else {
                this.showNotification('Transaction verification failed', 'error');
            }
            
        } catch (error) {
            console.error('Purchase error:', error);
            this.showNotification('Purchase failed. Please try again.', 'error');
        }
    }

    // Filters and Search
    filterProducts(category) {
        const filters = document.querySelectorAll('.category-filter');
        filters.forEach(filter => filter.classList.remove('active'));
        event.target.classList.add('active');

        let filteredProducts = this.products;
        if (category !== 'all') {
            filteredProducts = this.products.filter(product => product.category === category);
        }
        
        this.renderProducts(filteredProducts);
    }

    viewFarmerProducts(farmerName) {
        const farmerProducts = this.products.filter(product => product.farmer === farmerName);
        this.renderProducts(farmerProducts);
        
        // Scroll to products section
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        
        // Update active filter
        const filters = document.querySelectorAll('.category-filter');
        filters.forEach(filter => filter.classList.remove('active'));
        
        this.showNotification(`Showing products from ${farmerName}`, 'info');
    }

    // Event Listeners
    setupEventListeners() {
        // Connect wallet button
        document.getElementById('connectWallet').addEventListener('click', () => {
            if (this.account) {
                this.disconnectWallet();
            } else {
                this.connectWallet();
            }
        });

        // Category filters
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterProducts(category);
            });
        });

        // Farmer registration form
        document.getElementById('farmerRegistrationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.registerFarmer();
        });

        // Product form
        document.getElementById('addProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Search functionality
        this.setupSearch();
    }

    setupSearch() {
        // Create search input if it doesn't exist
        const navbar = document.querySelector('.navbar .container');
        if (!document.getElementById('searchInput')) {
            const searchHTML = `
                <div class="position-relative me-3">
                    <input type="text" id="searchInput" class="form-control" placeholder="Search products..." style="width: 250px;">
                    <button id="searchButton" class="btn btn-outline-primary btn-sm position-absolute top-0 end-0 h-100">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            `;
            
            const navbarNav = navbar.querySelector('.d-flex');
            navbarNav.insertAdjacentHTML('afterbegin', searchHTML);
            
            // Add search event listeners
            document.getElementById('searchInput').addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.searchProducts();
                }
            });
            
            document.getElementById('searchButton').addEventListener('click', () => {
                this.searchProducts();
            });
        }
    }

    searchProducts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (searchTerm.trim() === '') {
            this.renderProducts();
            return;
        }

        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.farmer.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );

        this.renderProducts(filteredProducts);
        
        // Scroll to products section
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }

    // Notifications
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `custom-notification alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 500px;
            animation: slideIn 0.3s ease-out;
        `;

        // Add notification content
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;

        // Add animation styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .custom-notification {
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border: none;
                    border-radius: 8px;
                }
            `;
            document.head.appendChild(style);
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Utility Functions
    formatAddress(address) {
        return `${address.substring(0, 6)}...${address.substring(38)}`;
    }

    formatPrice(price) {
        return `${price} ETH`;
    }

    // Initialize shopping cart modal
    initializeShoppingCart() {
        const cartModal = `
            <div class="modal fade" id="cartModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Shopping Cart</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="cartItems"></div>
                            <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                <h5>Total: <span id="cartTotal">0 ETH</span></h5>
                                <button class="btn btn-primary-custom" onclick="app.checkoutCart()">
                                    <i class="fas fa-credit-card me-2"></i>Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', cartModal);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FarmChainApp();
});

// Handle Web3 provider detection
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('✅ MetaMask is installed!');
        
        // Wait for app to be initialized
        if (window.app) {
            // The app will handle checking existing connections
            console.log('🔍 Checking for existing MetaMask connection...');
        }
    } else {
        console.log('⚠️ MetaMask is not installed.');
        
        // Show installation reminder
        setTimeout(() => {
            if (window.app) {
                window.app.showNotification(
                    'MetaMask is not installed. Please install MetaMask browser extension to use Web3 features.', 
                    'error'
                );
            }
        }, 2000);
    }
});
