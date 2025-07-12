// Web3 Smart Contract Simulation for FarmChain Marketplace
class FarmChainContract {
    constructor(web3, contractAddress) {
        this.web3 = web3;
        this.contractAddress = contractAddress;
        this.contractABI = [
            {
                "inputs": [
                    {"name": "_productId", "type": "uint256"},
                    {"name": "_quantity", "type": "uint256"},
                    {"name": "_farmerAddress", "type": "address"}
                ],
                "name": "purchaseProduct",
                "outputs": [{"name": "", "type": "bool"}],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {"name": "_productId", "type": "uint256"},
                    {"name": "_name", "type": "string"},
                    {"name": "_price", "type": "uint256"},
                    {"name": "_quantity", "type": "uint256"}
                ],
                "name": "addProduct",
                "outputs": [{"name": "", "type": "bool"}],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{"name": "_productId", "type": "uint256"}],
                "name": "getProduct",
                "outputs": [
                    {"name": "id", "type": "uint256"},
                    {"name": "name", "type": "string"},
                    {"name": "price", "type": "uint256"},
                    {"name": "quantity", "type": "uint256"},
                    {"name": "farmer", "type": "address"},
                    {"name": "verified", "type": "bool"}
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"name": "_farmerAddress", "type": "address"}],
                "name": "verifyFarmer",
                "outputs": [{"name": "", "type": "bool"}],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{"name": "_productId", "type": "uint256"}],
                "name": "getProductHistory",
                "outputs": [
                    {"name": "transactions", "type": "address[]"},
                    {"name": "timestamps", "type": "uint256[]"}
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];
        
        // Initialize contract instance
        this.contract = new web3.eth.Contract(this.contractABI, contractAddress);
    }

    // Purchase a product
    async purchaseProduct(productId, quantity, farmerAddress, buyerAddress, value) {
        try {
            const gasPrice = await this.web3.eth.getGasPrice();
            const gasEstimate = await this.contract.methods
                .purchaseProduct(productId, quantity, farmerAddress)
                .estimateGas({ from: buyerAddress, value: value });

            const transaction = await this.contract.methods
                .purchaseProduct(productId, quantity, farmerAddress)
                .send({
                    from: buyerAddress,
                    value: value,
                    gas: gasEstimate,
                    gasPrice: gasPrice
                });

            return {
                success: true,
                transactionHash: transaction.transactionHash,
                blockNumber: transaction.blockNumber,
                gasUsed: transaction.gasUsed
            };
        } catch (error) {
            console.error('Purchase failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Add a new product (for farmers)
    async addProduct(productId, name, price, quantity, farmerAddress) {
        try {
            const gasPrice = await this.web3.eth.getGasPrice();
            const gasEstimate = await this.contract.methods
                .addProduct(productId, name, price, quantity)
                .estimateGas({ from: farmerAddress });

            const transaction = await this.contract.methods
                .addProduct(productId, name, price, quantity)
                .send({
                    from: farmerAddress,
                    gas: gasEstimate,
                    gasPrice: gasPrice
                });

            return {
                success: true,
                transactionHash: transaction.transactionHash,
                blockNumber: transaction.blockNumber
            };
        } catch (error) {
            console.error('Add product failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get product information
    async getProduct(productId) {
        try {
            const result = await this.contract.methods.getProduct(productId).call();
            return {
                success: true,
                product: {
                    id: result.id,
                    name: result.name,
                    price: result.price,
                    quantity: result.quantity,
                    farmer: result.farmer,
                    verified: result.verified
                }
            };
        } catch (error) {
            console.error('Get product failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Verify farmer
    async verifyFarmer(farmerAddress, verifierAddress) {
        try {
            const gasPrice = await this.web3.eth.getGasPrice();
            const gasEstimate = await this.contract.methods
                .verifyFarmer(farmerAddress)
                .estimateGas({ from: verifierAddress });

            const transaction = await this.contract.methods
                .verifyFarmer(farmerAddress)
                .send({
                    from: verifierAddress,
                    gas: gasEstimate,
                    gasPrice: gasPrice
                });

            return {
                success: true,
                transactionHash: transaction.transactionHash
            };
        } catch (error) {
            console.error('Verify farmer failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get product transaction history
    async getProductHistory(productId) {
        try {
            const result = await this.contract.methods.getProductHistory(productId).call();
            return {
                success: true,
                history: {
                    transactions: result.transactions,
                    timestamps: result.timestamps
                }
            };
        } catch (error) {
            console.error('Get product history failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Listen to contract events
    listenToEvents() {
        // Product Purchase Event
        this.contract.events.ProductPurchased({
            fromBlock: 'latest'
        }, (error, event) => {
            if (error) {
                console.error('Event error:', error);
                return;
            }
            
            console.log('Product Purchased:', event.returnValues);
            
            // Trigger UI update
            if (window.app) {
                window.app.showNotification(
                    `Product purchased: ${event.returnValues.productId}`,
                    'success'
                );
            }
        });

        // Product Added Event
        this.contract.events.ProductAdded({
            fromBlock: 'latest'
        }, (error, event) => {
            if (error) {
                console.error('Event error:', error);
                return;
            }
            
            console.log('Product Added:', event.returnValues);
            
            // Trigger UI update
            if (window.app) {
                window.app.showNotification(
                    `New product added: ${event.returnValues.name}`,
                    'info'
                );
            }
        });

        // Farmer Verified Event
        this.contract.events.FarmerVerified({
            fromBlock: 'latest'
        }, (error, event) => {
            if (error) {
                console.error('Event error:', error);
                return;
            }
            
            console.log('Farmer Verified:', event.returnValues);
            
            // Trigger UI update
            if (window.app) {
                window.app.showNotification(
                    `Farmer verified: ${event.returnValues.farmerAddress}`,
                    'success'
                );
            }
        });
    }
}

// Utility functions for Web3 operations
class Web3Utils {
    constructor(web3) {
        this.web3 = web3;
    }

    // Convert ETH to Wei
    toWei(amount, unit = 'ether') {
        return this.web3.utils.toWei(amount.toString(), unit);
    }

    // Convert Wei to ETH
    fromWei(amount, unit = 'ether') {
        return this.web3.utils.fromWei(amount.toString(), unit);
    }

    // Get account balance
    async getBalance(address) {
        try {
            const balance = await this.web3.eth.getBalance(address);
            return this.fromWei(balance);
        } catch (error) {
            console.error('Get balance failed:', error);
            return 0;
        }
    }

    // Get transaction receipt
    async getTransactionReceipt(txHash) {
        try {
            return await this.web3.eth.getTransactionReceipt(txHash);
        } catch (error) {
            console.error('Get transaction receipt failed:', error);
            return null;
        }
    }

    // Get network ID
    async getNetworkId() {
        try {
            return await this.web3.eth.net.getId();
        } catch (error) {
            console.error('Get network ID failed:', error);
            return null;
        }
    }

    // Get gas price
    async getGasPrice() {
        try {
            return await this.web3.eth.getGasPrice();
        } catch (error) {
            console.error('Get gas price failed:', error);
            return this.toWei('20', 'gwei'); // Default fallback
        }
    }

    // Estimate gas
    async estimateGas(transaction) {
        try {
            return await this.web3.eth.estimateGas(transaction);
        } catch (error) {
            console.error('Estimate gas failed:', error);
            return 21000; // Default gas limit
        }
    }

    // Generate transaction
    async generateTransaction(from, to, value, data = '0x') {
        const gasPrice = await this.getGasPrice();
        const nonce = await this.web3.eth.getTransactionCount(from);
        
        const transaction = {
            from: from,
            to: to,
            value: value,
            gas: 21000,
            gasPrice: gasPrice,
            nonce: nonce,
            data: data
        };

        // Estimate gas if data is provided
        if (data !== '0x') {
            transaction.gas = await this.estimateGas(transaction);
        }

        return transaction;
    }

    // Validate address
    isValidAddress(address) {
        return this.web3.utils.isAddress(address);
    }

    // Format address for display
    formatAddress(address, length = 6) {
        if (!this.isValidAddress(address)) return 'Invalid Address';
        
        const start = address.substring(0, length + 2);
        const end = address.substring(address.length - length);
        return `${start}...${end}`;
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FarmChainContract, Web3Utils };
} else {
    window.FarmChainContract = FarmChainContract;
    window.Web3Utils = Web3Utils;
}
