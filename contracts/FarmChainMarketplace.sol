// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FarmChain Marketplace Smart Contract
 * @dev A decentralized marketplace for farm products
 */
contract FarmChainMarketplace {
    
    // State variables
    address public owner;
    uint256 public totalProducts;
    uint256 public totalFarmers;
    uint256 public totalTransactions;
    
    // Structs
    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price; // in wei
        uint256 quantity;
        string category;
        address farmer;
        bool isActive;
        uint256 createdAt;
        string imageHash; // IPFS hash
    }
    
    struct Farmer {
        address farmerAddress;
        string name;
        string location;
        string[] specialties;
        bool isVerified;
        uint256 reputation;
        uint256 totalSales;
        uint256 registeredAt;
    }
    
    struct Transaction {
        uint256 id;
        uint256 productId;
        address buyer;
        address farmer;
        uint256 quantity;
        uint256 amount;
        uint256 timestamp;
        string status; // "pending", "completed", "cancelled"
    }
    
    // Mappings
    mapping(uint256 => Product) public products;
    mapping(address => Farmer) public farmers;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public farmerProducts;
    mapping(address => uint256[]) public buyerTransactions;
    
    // Events
    event ProductAdded(uint256 indexed productId, string name, address indexed farmer, uint256 price);
    event ProductPurchased(uint256 indexed transactionId, uint256 indexed productId, address indexed buyer, uint256 quantity, uint256 amount);
    event FarmerRegistered(address indexed farmer, string name, string location);
    event FarmerVerified(address indexed farmer, bool verified);
    event ProductUpdated(uint256 indexed productId, string name, uint256 price, uint256 quantity);
    event TransactionStatusUpdated(uint256 indexed transactionId, string status);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyVerifiedFarmer() {
        require(farmers[msg.sender].isVerified, "Only verified farmers can call this function");
        _;
    }
    
    modifier productExists(uint256 _productId) {
        require(_productId > 0 && _productId <= totalProducts, "Product does not exist");
        _;
    }
    
    modifier productActive(uint256 _productId) {
        require(products[_productId].isActive, "Product is not active");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        totalProducts = 0;
        totalFarmers = 0;
        totalTransactions = 0;
    }
    
    /**
     * @dev Register a new farmer
     * @param _name Farmer's name
     * @param _location Farmer's location
     * @param _specialties Array of farmer's specialties
     */
    function registerFarmer(
        string memory _name,
        string memory _location,
        string[] memory _specialties
    ) public {
        require(bytes(farmers[msg.sender].name).length == 0, "Farmer already registered");
        
        farmers[msg.sender] = Farmer({
            farmerAddress: msg.sender,
            name: _name,
            location: _location,
            specialties: _specialties,
            isVerified: false,
            reputation: 0,
            totalSales: 0,
            registeredAt: block.timestamp
        });
        
        totalFarmers++;
        emit FarmerRegistered(msg.sender, _name, _location);
    }
    
    /**
     * @dev Verify a farmer (only owner can call)
     * @param _farmerAddress Address of the farmer to verify
     * @param _verified Verification status
     */
    function verifyFarmer(address _farmerAddress, bool _verified) public onlyOwner {
        require(bytes(farmers[_farmerAddress].name).length > 0, "Farmer not registered");
        
        farmers[_farmerAddress].isVerified = _verified;
        emit FarmerVerified(_farmerAddress, _verified);
    }
    
    /**
     * @dev Add a new product (only verified farmers can call)
     * @param _name Product name
     * @param _description Product description
     * @param _price Product price in wei
     * @param _quantity Product quantity
     * @param _category Product category
     * @param _imageHash IPFS hash of product image
     */
    function addProduct(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantity,
        string memory _category,
        string memory _imageHash
    ) public onlyVerifiedFarmer {
        require(_price > 0, "Price must be greater than 0");
        require(_quantity > 0, "Quantity must be greater than 0");
        require(bytes(_name).length > 0, "Product name cannot be empty");
        
        totalProducts++;
        
        products[totalProducts] = Product({
            id: totalProducts,
            name: _name,
            description: _description,
            price: _price,
            quantity: _quantity,
            category: _category,
            farmer: msg.sender,
            isActive: true,
            createdAt: block.timestamp,
            imageHash: _imageHash
        });
        
        farmerProducts[msg.sender].push(totalProducts);
        
        emit ProductAdded(totalProducts, _name, msg.sender, _price);
    }
    
    /**
     * @dev Update product details (only product owner can call)
     * @param _productId Product ID
     * @param _name New product name
     * @param _description New product description
     * @param _price New product price
     * @param _quantity New product quantity
     */
    function updateProduct(
        uint256 _productId,
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantity
    ) public productExists(_productId) {
        require(products[_productId].farmer == msg.sender, "Only product owner can update");
        require(_price > 0, "Price must be greater than 0");
        
        products[_productId].name = _name;
        products[_productId].description = _description;
        products[_productId].price = _price;
        products[_productId].quantity = _quantity;
        
        emit ProductUpdated(_productId, _name, _price, _quantity);
    }
    
    /**
     * @dev Purchase a product
     * @param _productId Product ID
     * @param _quantity Quantity to purchase
     */
    function purchaseProduct(uint256 _productId, uint256 _quantity) 
        public 
        payable 
        productExists(_productId) 
        productActive(_productId) 
    {
        Product storage product = products[_productId];
        require(_quantity > 0, "Quantity must be greater than 0");
        require(product.quantity >= _quantity, "Insufficient product quantity");
        
        uint256 totalAmount = product.price * _quantity;
        require(msg.value >= totalAmount, "Insufficient payment");
        
        // Update product quantity
        product.quantity -= _quantity;
        
        // Create transaction record
        totalTransactions++;
        transactions[totalTransactions] = Transaction({
            id: totalTransactions,
            productId: _productId,
            buyer: msg.sender,
            farmer: product.farmer,
            quantity: _quantity,
            amount: totalAmount,
            timestamp: block.timestamp,
            status: "completed"
        });
        
        // Update farmer stats
        farmers[product.farmer].totalSales += totalAmount;
        farmers[product.farmer].reputation += 1;
        
        // Add to buyer's transaction history
        buyerTransactions[msg.sender].push(totalTransactions);
        
        // Transfer payment to farmer
        payable(product.farmer).transfer(totalAmount);
        
        // Refund excess payment
        if (msg.value > totalAmount) {
            payable(msg.sender).transfer(msg.value - totalAmount);
        }
        
        emit ProductPurchased(totalTransactions, _productId, msg.sender, _quantity, totalAmount);
    }
    
    /**
     * @dev Get product details
     * @param _productId Product ID
     */
    function getProduct(uint256 _productId) 
        public 
        view 
        productExists(_productId) 
        returns (
            uint256 id,
            string memory name,
            string memory description,
            uint256 price,
            uint256 quantity,
            string memory category,
            address farmer,
            bool isActive,
            uint256 createdAt,
            string memory imageHash
        ) 
    {
        Product memory product = products[_productId];
        return (
            product.id,
            product.name,
            product.description,
            product.price,
            product.quantity,
            product.category,
            product.farmer,
            product.isActive,
            product.createdAt,
            product.imageHash
        );
    }
    
    /**
     * @dev Get farmer details
     * @param _farmerAddress Farmer's address
     */
    function getFarmer(address _farmerAddress) 
        public 
        view 
        returns (
            address farmerAddress,
            string memory name,
            string memory location,
            string[] memory specialties,
            bool isVerified,
            uint256 reputation,
            uint256 totalSales,
            uint256 registeredAt
        ) 
    {
        Farmer memory farmer = farmers[_farmerAddress];
        return (
            farmer.farmerAddress,
            farmer.name,
            farmer.location,
            farmer.specialties,
            farmer.isVerified,
            farmer.reputation,
            farmer.totalSales,
            farmer.registeredAt
        );
    }
    
    /**
     * @dev Get transaction details
     * @param _transactionId Transaction ID
     */
    function getTransaction(uint256 _transactionId) 
        public 
        view 
        returns (
            uint256 id,
            uint256 productId,
            address buyer,
            address farmer,
            uint256 quantity,
            uint256 amount,
            uint256 timestamp,
            string memory status
        ) 
    {
        Transaction memory transaction = transactions[_transactionId];
        return (
            transaction.id,
            transaction.productId,
            transaction.buyer,
            transaction.farmer,
            transaction.quantity,
            transaction.amount,
            transaction.timestamp,
            transaction.status
        );
    }
    
    /**
     * @dev Get farmer's products
     * @param _farmerAddress Farmer's address
     */
    function getFarmerProducts(address _farmerAddress) public view returns (uint256[] memory) {
        return farmerProducts[_farmerAddress];
    }
    
    /**
     * @dev Get buyer's transaction history
     * @param _buyerAddress Buyer's address
     */
    function getBuyerTransactions(address _buyerAddress) public view returns (uint256[] memory) {
        return buyerTransactions[_buyerAddress];
    }
    
    /**
     * @dev Toggle product active status (only product owner can call)
     * @param _productId Product ID
     */
    function toggleProductStatus(uint256 _productId) public productExists(_productId) {
        require(products[_productId].farmer == msg.sender, "Only product owner can toggle status");
        
        products[_productId].isActive = !products[_productId].isActive;
    }
    
    /**
     * @dev Withdraw contract balance (only owner can call)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner).transfer(balance);
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats() public view returns (uint256, uint256, uint256) {
        return (totalProducts, totalFarmers, totalTransactions);
    }
}
