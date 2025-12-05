const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

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
  console.log(`✅ Connected to network: ${network.name} (chainId: ${network.chainId})`);
}).catch(err => {
  console.error(`❌ Failed to connect to RPC: ${rpcUrl}`);
  console.error(`Error: ${err.message}`);
  console.error(`⚠️  Make sure Anvil is running: cd contracts && anvil`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get reputation for an address
app.get('/reputation/:address', async (req, res) => {
  try {
    const address = req.params.address;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    if (!REPUTE_CORE_ADDRESS) {
      return res.status(503).json({ error: 'ReputeCore contract not configured' });
    }

    const reputeCore = new ethers.Contract(REPUTE_CORE_ADDRESS, REPUTE_CORE_ABI, provider);
    
    const reputation = await reputeCore.getReputation(address);
    const totalReputation = await reputeCore.getTotalReputation(address);
    const moduleCount = await reputeCore.getModuleCount();

    res.json({
      address,
      reputation: reputation.toString(),
      totalReputation: totalReputation.toString(),
      moduleCount: moduleCount.toString(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching reputation:', error);
    res.status(500).json({ error: 'Failed to fetch reputation', message: error.message });
  }
});

// Get badges for an address
app.get('/badges/:address', async (req, res) => {
  try {
    const address = req.params.address;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    if (!BADGE_NFT_ADDRESS) {
      return res.status(503).json({ error: 'BadgeNFT contract not configured' });
    }

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

    res.json({
      address,
      badgeCount: badges.length,
      badges,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
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

// Start server
app.listen(PORT, () => {
  console.log(`ReputeBase API server running on port ${PORT}`);
  console.log(`Network: ${process.env.NETWORK || 'sepolia'}`);
  console.log(`RPC URL: ${getRpcUrl()}`);
  console.log(`ReputeCore: ${REPUTE_CORE_ADDRESS || 'Not configured'}`);
  console.log(`BadgeNFT: ${BADGE_NFT_ADDRESS || 'Not configured'}`);
});

