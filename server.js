const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline scripts for development
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static file serving with proper MIME types
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath, stat) => {
        if (filePath.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

// In-memory storage for demo (use MongoDB in production)
let products = [
    {
        id: 1,
        name: "Organic Tomatoes",
        price: "₹150", // Indian Rupees
        priceETH: "0.002", // ETH equivalent
        category: "vegetables",
        image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop",
        farmer: "Rajesh Kumar",
        farmerAddress: "0x1234...5678",
        location: "Punjab, India",
        description: "Fresh organic tomatoes grown without pesticides in the fertile fields of Punjab",
        quantity: 50,
        unit: "kg",
        verified: true,
        rating: 4.8,
        reviews: 23
    },
    {
        id: 2,
        name: "Fresh Strawberries",
        price: "₹300",
        priceETH: "0.004",
        category: "fruits",
        image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop",
        farmer: "Priya Sharma",
        farmerAddress: "0x2345...6789",
        location: "Himachal Pradesh, India",
        description: "Sweet, juicy strawberries picked fresh daily from hill stations",
        quantity: 30,
        unit: "kg",
        verified: true,
        rating: 4.9,
        reviews: 45
    },
    {
        id: 3,
        name: "Organic Carrots",
        price: "₹80",
        priceETH: "0.001",
        category: "vegetables",
        image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=300&fit=crop",
        farmer: "Suresh Patel",
        farmerAddress: "0x3456...7890",
        location: "Gujarat, India",
        description: "Crisp, sweet organic carrots perfect for any meal, grown in Gujarat's rich soil",
        quantity: 75,
        unit: "kg",
        verified: true,
        rating: 4.7,
        reviews: 18
    },
    {
        id: 4,
        name: "Basmati Rice",
        price: "₹120",
        priceETH: "0.0015",
        category: "grains",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
        farmer: "Amarjeet Singh",
        farmerAddress: "0x4567...8901",
        location: "Haryana, India",
        description: "Premium quality Basmati rice, aromatic and long-grain from Haryana fields",
        quantity: 200,
        unit: "kg",
        verified: true,
        rating: 4.6,
        reviews: 12
    },
    {
        id: 5,
        name: "Fresh Buffalo Milk",
        price: "₹60",
        priceETH: "0.0008",
        category: "dairy",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
        farmer: "Lakshmi Devi",
        farmerAddress: "0x5678...9012",
        location: "Uttar Pradesh, India",
        description: "Pure, fresh buffalo milk from grass-fed animals in rural UP",
        quantity: 100,
        unit: "liters",
        verified: true,
        rating: 4.9,
        reviews: 67
    },
    {
        id: 6,
        name: "Organic Mangoes",
        price: "₹200",
        priceETH: "0.0025",
        category: "fruits",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
        farmer: "Ramesh Yadav",
        farmerAddress: "0x6789...0123",
        location: "Maharashtra, India",
        description: "Sweet, juicy Alphonso mangoes from the orchards of Maharashtra",
        quantity: 80,
        unit: "kg",
        verified: true,
        rating: 4.8,
        reviews: 34
    },
    {
        id: 7,
        name: "Organic Turmeric Powder",
        price: "₹180",
        priceETH: "0.0022",
        category: "spices",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop",
        farmer: "Meera Patel",
        farmerAddress: "0x7890...1234",
        location: "Kerala, India",
        description: "Pure organic turmeric powder with high curcumin content, traditionally grown in Kerala",
        quantity: 25,
        unit: "kg",
        verified: true,
        rating: 4.9,
        reviews: 28
    },
    {
        id: 8,
        name: "Red Chili Powder",
        price: "₹150",
        priceETH: "0.0018",
        category: "spices",
        image: "https://images.unsplash.com/photo-1596040832847-d0085d4f8e87?w=400&h=300&fit=crop",
        farmer: "Kiran Singh",
        farmerAddress: "0x8901...2345",
        location: "Rajasthan, India",
        description: "Authentic red chili powder with perfect heat and flavor from Rajasthan",
        quantity: 40,
        unit: "kg",
        verified: true,
        rating: 4.7,
        reviews: 19
    },
    {
        id: 9,
        name: "Garam Masala",
        price: "₹250",
        priceETH: "0.003",
        category: "spices",
        image: "https://images.unsplash.com/photo-1596040832847-d0085d4f8e87?w=400&h=300&fit=crop",
        farmer: "Arjun Sharma",
        farmerAddress: "0x9012...3456",
        location: "Uttar Pradesh, India",
        description: "Traditional garam masala blend with authentic spices from UP",
        quantity: 15,
        unit: "kg",
        verified: true,
        rating: 4.8,
        reviews: 22
    }
];

let farmers = [
    {
        id: 1,
        name: "Rajesh Kumar",
        address: "0x1234...5678",
        location: "Punjab, India",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        specialties: ["Organic Vegetables", "Wheat", "Rice"],
        experience: "15 years",
        rating: 4.8,
        totalProducts: 12,
        verified: true,
        bio: "Passionate organic farmer from Punjab, dedicated to sustainable agriculture practices and traditional farming methods."
    },
    {
        id: 2,
        name: "Priya Sharma",
        address: "0x2345...6789",
        location: "Himachal Pradesh, India",
        image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300&h=300&fit=crop",
        specialties: ["Fruits", "Berries", "Apple Orchards"],
        experience: "12 years",
        rating: 4.9,
        totalProducts: 8,
        verified: true,
        bio: "Hill station farmer specializing in fresh, seasonal fruits and berries grown in the cool climate of Himachal."
    },
    {
        id: 3,
        name: "Suresh Patel",
        address: "0x3456...7890",
        location: "Gujarat, India",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
        specialties: ["Cotton", "Groundnut", "Vegetables"],
        experience: "20 years",
        rating: 4.7,
        totalProducts: 15,
        verified: true,
        bio: "Third-generation farmer from Gujarat committed to organic and sustainable farming methods."
    },
    {
        id: 4,
        name: "Lakshmi Devi",
        address: "0x5678...9012",
        location: "Uttar Pradesh, India",
        image: "https://images.unsplash.com/photo-1494790108755-2616c96f8a14?w=300&h=300&fit=crop",
        specialties: ["Dairy", "Buffalo Farming", "Milk Products"],
        experience: "18 years",
        rating: 4.9,
        totalProducts: 6,
        verified: true,
        bio: "Dairy farmer from UP focused on producing high-quality milk and traditional dairy products."
    },
    {
        id: 5,
        name: "Meera Patel",
        address: "0x7890...1234",
        location: "Kerala, India",
        image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300&h=300&fit=crop",
        specialties: ["Spices", "Turmeric", "Organic Spices"],
        experience: "14 years",
        rating: 4.9,
        totalProducts: 8,
        verified: true,
        bio: "Spice farmer from Kerala specializing in organic turmeric and traditional spices."
    },
    {
        id: 6,
        name: "Kiran Singh",
        address: "0x8901...2345",
        location: "Rajasthan, India",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
        specialties: ["Spices", "Chili", "Desert Farming"],
        experience: "16 years",
        rating: 4.7,
        totalProducts: 5,
        verified: true,
        bio: "Desert farmer from Rajasthan known for high-quality chili and spice production."
    }
];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        static_files: {
            css: 'Available at /css/custom.css',
            js: 'Available at /js/app.js and /js/web3-contract.js'
        }
    });
});

// API Routes
app.get('/api/products', (req, res) => {
    try {
        const { category, search, farmer } = req.query;
        let filteredProducts = [...products];

        if (category && category !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === category
            );
        }

        if (search) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (farmer) {
            filteredProducts = filteredProducts.filter(product =>
                product.farmer.toLowerCase().includes(farmer.toLowerCase())
            );
        }

        res.json({
            success: true,
            products: filteredProducts,
            total: filteredProducts.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
});

app.get('/api/products/:id', (req, res) => {
    try {
        const product = products.find(p => p.id === parseInt(req.params.id));
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
});

app.get('/api/farmers', (req, res) => {
    try {
        const { location, specialty } = req.query;
        let filteredFarmers = [...farmers];

        if (location) {
            filteredFarmers = filteredFarmers.filter(farmer =>
                farmer.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        if (specialty) {
            filteredFarmers = filteredFarmers.filter(farmer =>
                farmer.specialties.some(s => 
                    s.toLowerCase().includes(specialty.toLowerCase())
                )
            );
        }

        res.json({
            success: true,
            farmers: filteredFarmers,
            total: filteredFarmers.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching farmers',
            error: error.message
        });
    }
});

app.get('/api/farmers/:id', (req, res) => {
    try {
        const farmer = farmers.find(f => f.id === parseInt(req.params.id));
        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }
        res.json({
            success: true,
            farmer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching farmer',
            error: error.message
        });
    }
});

// Web3 Integration Routes
app.post('/api/verify-transaction', (req, res) => {
    try {
        const { transactionHash, productId, buyerAddress, amount } = req.body;
        
        // In a real application, you would verify the transaction on the blockchain
        // For demo purposes, we'll simulate verification
        
        if (!transactionHash || !productId || !buyerAddress || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Simulate transaction verification
        setTimeout(() => {
            const product = products.find(p => p.id === parseInt(productId));
            if (product && product.quantity > 0) {
                product.quantity -= 1; // Decrease quantity
                
                res.json({
                    success: true,
                    message: 'Transaction verified successfully',
                    transaction: {
                        hash: transactionHash,
                        productId,
                        buyerAddress,
                        amount,
                        timestamp: new Date().toISOString(),
                        verified: true
                    }
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Product not available or out of stock'
                });
            }
        }, 1000);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying transaction',
            error: error.message
        });
    }
});

app.post('/api/create-product', (req, res) => {
    try {
        const { name, price, priceETH, category, description, quantity, unit, image, farmerAddress } = req.body;
        
        if (!name || !price || !category || !description || !quantity || !unit || !farmerAddress) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const farmer = farmers.find(f => f.address === farmerAddress);
        if (!farmer) {
            return res.status(400).json({
                success: false,
                message: 'Farmer not found'
            });
        }

        const newProduct = {
            id: products.length + 1,
            name,
            price: price.includes('₹') ? price : `₹${price}`,
            priceETH: priceETH || (parseFloat(price.replace('₹', '')) * 0.000012).toFixed(6),
            category,
            image: image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
            farmer: farmer.name,
            farmerAddress,
            location: farmer.location,
            description,
            quantity: parseInt(quantity),
            unit,
            verified: true,
            rating: 4.5,
            reviews: 0,
            createdAt: new Date().toISOString()
        };

        products.push(newProduct);
        farmer.totalProducts += 1;

        console.log('New product created:', newProduct);

        res.json({
            success: true,
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
});

// Cart storage (in production, use sessions or user-specific storage)
let userCarts = {}; // Format: { userAddress: [cartItems] }

// Cart Management Routes
app.get('/api/cart/:userAddress', (req, res) => {
    try {
        const { userAddress } = req.params;
        const cart = userCarts[userAddress] || [];
        res.json({
            success: true,
            cart: cart
        });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting cart',
            error: error.message
        });
    }
});

app.post('/api/cart/add', (req, res) => {
    try {
        const { userAddress, productId, quantity } = req.body;
        
        if (!userAddress || !productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const product = products.find(p => p.id === parseInt(productId));
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (!userCarts[userAddress]) {
            userCarts[userAddress] = [];
        }

        const existingItem = userCarts[userAddress].find(item => item.productId === parseInt(productId));
        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            userCarts[userAddress].push({
                productId: parseInt(productId),
                quantity: parseInt(quantity),
                product: product
            });
        }

        console.log('Item added to cart:', { userAddress, productId, quantity });

        res.json({
            success: true,
            message: 'Item added to cart',
            cart: userCarts[userAddress]
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding to cart',
            error: error.message
        });
    }
});

app.post('/api/cart/remove', (req, res) => {
    try {
        const { userAddress, productId } = req.body;
        
        if (!userAddress || !productId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        if (!userCarts[userAddress]) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        userCarts[userAddress] = userCarts[userAddress].filter(item => item.productId !== parseInt(productId));

        res.json({
            success: true,
            message: 'Item removed from cart',
            cart: userCarts[userAddress]
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing from cart',
            error: error.message
        });
    }
});

app.post('/api/cart/update', (req, res) => {
    try {
        const { userAddress, productId, quantity } = req.body;
        
        if (!userAddress || !productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        if (!userCarts[userAddress]) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const item = userCarts[userAddress].find(item => item.productId === parseInt(productId));
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        if (parseInt(quantity) <= 0) {
            userCarts[userAddress] = userCarts[userAddress].filter(item => item.productId !== parseInt(productId));
        } else {
            item.quantity = parseInt(quantity);
        }

        res.json({
            success: true,
            message: 'Cart updated',
            cart: userCarts[userAddress]
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart',
            error: error.message
        });
    }
});

app.post('/api/cart/clear', (req, res) => {
    try {
        const { userAddress } = req.body;
        
        if (!userAddress) {
            return res.status(400).json({
                success: false,
                message: 'Missing user address'
            });
        }

        userCarts[userAddress] = [];

        res.json({
            success: true,
            message: 'Cart cleared',
            cart: []
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cart',
            error: error.message
        });
    }
});

// Register new farmer
app.post('/api/register-farmer', (req, res) => {
    try {
        const { name, location, bio, specialty, experience, farmSize, walletAddress } = req.body;
        
        // Validate required fields
        if (!name || !location || !specialty || !experience || !farmSize) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields',
                required: ['name', 'location', 'specialty', 'experience', 'farmSize']
            });
        }
        
        // Check if farmer already exists
        const existingFarmer = farmers.find(f => f.name === name || (walletAddress && f.address === walletAddress));
        if (existingFarmer) {
            return res.status(409).json({ 
                success: false,
                message: 'Farmer already registered' 
            });
        }
        
        // Create new farmer
        const newFarmer = {
            id: farmers.length + 1,
            name,
            address: walletAddress || `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
            location,
            image: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1507003211169-0a1dd7228f2d' : '1544723795-3fb6469f5b39'}?w=300&h=300&fit=crop`,
            specialties: [specialty],
            bio: bio || `Experienced farmer from ${location} specializing in ${specialty}`,
            experience: `${experience} years`,
            rating: 4.5,
            totalProducts: 0,
            verified: false,
            farmSize: parseFloat(farmSize),
            joinDate: new Date().toISOString()
        };
        
        farmers.push(newFarmer);
        
        console.log('New farmer registered:', newFarmer);
        
        res.json({
            success: true,
            message: 'Farmer registered successfully',
            farmer: newFarmer
        });
        
    } catch (error) {
        console.error('Error registering farmer:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error registering farmer',
            error: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found'
    });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 FarmChain server running on port ${PORT}`);
    console.log(`📱 Access the app at: http://localhost:${PORT}`);
    console.log(`🔗 API available at: http://localhost:${PORT}/api`);
});

module.exports = app;