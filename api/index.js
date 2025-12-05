const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const winston = require('winston');
require('dotenv').config();

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'reputebase-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Add file logging in production
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ 
    filename: 'error.log', 
    level: 'error' 
  }));
  logger.add(new winston.transports.File({ 
    filename: 'combined.log' 
  }));
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Base network configuration
const BASE_MAINNET_RPC = process.env.BASE_MAINNET_RPC || 'https://mainnet.base.org';
const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
const ANVIL_RPC = process.env.ANVIL_RPC_URL || 'http://localhost:8545';
const REPUTE_CORE_ADDRESS = process.env.REPUTE_CORE_ADDRESS;
const BADGE_NFT_ADDRESS = process.env.BADGE_NFT_ADDRESS;

// ABI for ReputeCore (simplified)
const REPUTE_CORE_ABI = [
  'function getReputation(address user) external view returns (uint256)',
  'function getTotalReputation(address user) external view returns (uint256)',
  'function getModuleCount() external view returns (uint256)'
];

// ABI for BadgeNFT (simplified)
const BADGE_NFT_ABI = [
  'function balanceOf(address owner) external view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  'function getUserBadges(address user) external view returns (uint256[])'
];

// Initialize provider
const getRpcUrl = () => {
  if (process.env.NETWORK === 'mainnet') return BASE_MAINNET_RPC;
  if (process.env.NETWORK === 'local' || process.env.NETWORK === 'anvil') return ANVIL_RPC;
  return BASE_SEPOLIA_RPC;
};

const rpcUrl = getRpcUrl();
const provider = new ethers.JsonRpcProvider(rpcUrl);

// Test connection on startup
provider.getNetwork().then(network => {
  logger.info('Connected to network', { 
    name: network.name, 
    chainId: network.chainId.toString() 
  });
}).catch(err => {
  logger.error('Failed to connect to RPC', { 
    rpcUrl, 
    error: err.message,
    stack: err.stack 
  });
});

// Request logging middleware
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  logger.debug('Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get reputation for an address
app.get('/reputation/:address', async (req, res) => {
  const startTime = Date.now();
  try {
    const address = req.params.address;
    
    if (!ethers.isAddress(address)) {
      logger.warn('Invalid address format', { address });
      return res.status(400).json({ error: 'Invalid address format' });
    }

    if (!REPUTE_CORE_ADDRESS) {
      logger.error('ReputeCore contract not configured');
      return res.status(503).json({ error: 'ReputeCore contract not configured' });
    }

    logger.info('Fetching reputation', { address });
    const reputeCore = new ethers.Contract(REPUTE_CORE_ADDRESS, REPUTE_CORE_ABI, provider);
    
    const reputation = await reputeCore.getReputation(address);
    const totalReputation = await reputeCore.getTotalReputation(address);
    const moduleCount = await reputeCore.getModuleCount();

    const duration = Date.now() - startTime;
    logger.info('Reputation fetched successfully', { 
      address, 
      reputation: reputation.toString(),
      duration: `${duration}ms`
    });

    res.json({
      address,
      reputation: reputation.toString(),
      totalReputation: totalReputation.toString(),
      moduleCount: moduleCount.toString(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Error fetching reputation', { 
      address: req.params.address,
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`
    });
    res.status(500).json({ error: 'Failed to fetch reputation', message: error.message });
  }
});

// Get badges for an address
app.get('/badges/:address', async (req, res) => {
  const startTime = Date.now();
  try {
    const address = req.params.address;
    
    if (!ethers.isAddress(address)) {
      logger.warn('Invalid address format', { address });
      return res.status(400).json({ error: 'Invalid address format' });
    }

    if (!BADGE_NFT_ADDRESS) {
      logger.error('BadgeNFT contract not configured');
      return res.status(503).json({ error: 'BadgeNFT contract not configured' });
    }

    logger.info('Fetching badges', { address });
    const badgeNFT = new ethers.Contract(BADGE_NFT_ADDRESS, BADGE_NFT_ABI, provider);
    
    const badgeIds = await badgeNFT.getUserBadges(address);
    const badges = [];

    for (let i = 0; i < badgeIds.length; i++) {
      const tokenId = badgeIds[i];
      const tokenURI = await badgeNFT.tokenURI(tokenId);
      badges.push({
        tokenId: tokenId.toString(),
        tokenURI
      });
    }

    const duration = Date.now() - startTime;
    logger.info('Badges fetched successfully', { 
      address, 
      badgeCount: badges.length,
      duration: `${duration}ms`
    });

    res.json({
      address,
      badgeCount: badges.length,
      badges,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Error fetching badges', { 
      address: req.params.address,
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`
    });
    res.status(500).json({ error: 'Failed to fetch badges', message: error.message });
  }
});

// Post onchain event (for future use)
app.post('/events/onchain', async (req, res) => {
  try {
    const { address, eventType, data } = req.body;
    
    if (!address || !eventType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Process onchain event
    // This would typically trigger reputation updates
    
    res.json({
      success: true,
      message: 'Event received',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing event:', error);
    res.status(500).json({ error: 'Failed to process event', message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
});

// Start server
app.listen(PORT, () => {
  logger.info('ReputeBase API server started', {
    port: PORT,
    network: process.env.NETWORK || 'sepolia',
    rpcUrl: getRpcUrl(),
    reputeCore: REPUTE_CORE_ADDRESS || 'Not configured',
    badgeNFT: BADGE_NFT_ADDRESS || 'Not configured',
    environment: process.env.NODE_ENV || 'development'
  });
});

