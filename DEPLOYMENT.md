# 🚀 ReputeBase Deployment Guide

This guide will help you deploy ReputeBase to Base Sepolia (testnet) and Base Mainnet.

## 📋 Prerequisites

1. **Foundry installed** - [Install Foundry](https://book.getfoundry.sh/getting-started/installation)
2. **Node.js ≥18.x** - For API and frontend
3. **Base Sepolia ETH** - For testnet deployment (get from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))
4. **Base Mainnet ETH** - For mainnet deployment
5. **Basescan API Key** - For contract verification (get from [Basescan](https://basescan.org/apis))

## 🔧 Setup

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/reputebase.git
cd reputebase
npm run install:all
```

### 2. Configure Environment Variables

#### Contracts

```bash
cd contracts
cp .env.example .env
```

Edit `.env`:
```bash
PRIVATE_KEY=your_deployer_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

#### API

```bash
cd ../api
cp .env.example .env
```

Edit `.env` (you'll update addresses after deployment):
```bash
NETWORK=sepolia
BASE_MAINNET_RPC=https://mainnet.base.org
BASE_SEPOLIA_RPC=https://sepolia.base.org
REPUTE_CORE_ADDRESS=
BADGE_NFT_ADDRESS=
PORT=3001
```

#### Frontend

```bash
cd ../frontend
cp .env.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_REPUTE_CORE_ADDRESS=
NEXT_PUBLIC_BADGE_NFT_ADDRESS=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CHAIN_ID=84532
```

## 📝 Deploy Smart Contracts

### Deploy to Base Sepolia (Testnet)

```bash
cd contracts

# Set environment variables
export PRIVATE_KEY=your_private_key
export BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
export BASESCAN_API_KEY=your_api_key

# Deploy
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_sepolia \
  --broadcast \
  --verify
```

After deployment, you'll see output like:
```
ReputeCore deployed at: 0x...
BadgeNFT deployed at: 0x...
TxVolumeModule deployed at: 0x...
```

**Save these addresses!** You'll need them for API and frontend configuration.

### Deploy to Base Mainnet

⚠️ **Warning**: Only deploy to mainnet after thorough testing on Sepolia!

```bash
cd contracts

# Set environment variables
export PRIVATE_KEY=your_private_key
export BASE_MAINNET_RPC_URL=https://mainnet.base.org
export BASESCAN_API_KEY=your_api_key

# Deploy
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_mainnet \
  --broadcast \
  --verify
```

### Using GitHub Actions

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `PRIVATE_KEY` - Your deployer private key
   - `BASE_SEPOLIA_RPC_URL` - Base Sepolia RPC URL
   - `BASE_MAINNET_RPC_URL` - Base Mainnet RPC URL
   - `BASESCAN_API_KEY` - Basescan API key

3. Go to Actions → Deploy Contracts → Run workflow
4. Select network and verification options
5. Run the workflow

## 🔄 Update Configuration After Deployment

### 1. Update API `.env`

```bash
cd api
# Edit .env with deployed addresses
REPUTE_CORE_ADDRESS=0x... # from deployment output
BADGE_NFT_ADDRESS=0x... # from deployment output
```

### 2. Update Frontend `.env.local`

```bash
cd frontend
# Edit .env.local with deployed addresses
NEXT_PUBLIC_REPUTE_CORE_ADDRESS=0x... # from deployment output
NEXT_PUBLIC_BADGE_NFT_ADDRESS=0x... # from deployment output
NEXT_PUBLIC_CHAIN_ID=84532 # for Sepolia, 8453 for Mainnet
```

## 🚀 Run Services

### API Server

```bash
cd api
npm run dev
# API will be available at http://localhost:3001
```

### Frontend

```bash
cd frontend
npm run dev
# Frontend will be available at http://localhost:3000
```

## 📦 Deploy Frontend to Production

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. In the `frontend` directory: `vercel`
3. Follow the prompts
4. Add environment variables in Vercel dashboard

### Other Platforms

You can deploy to any platform that supports Next.js:
- Netlify
- Railway
- Render
- Your own server

## ✅ Verification Checklist

After deployment, verify:

- [ ] Contracts deployed and verified on Basescan
- [ ] API can query contracts (test `/health` and `/reputation/:address`)
- [ ] Frontend connects to wallet
- [ ] Frontend displays reputation data
- [ ] Badge minting works
- [ ] All tests pass
- [ ] README updated with contract addresses
- [ ] Environment variables set correctly

## 🔗 Update README

After deployment, update `README.md` with:

```markdown
## 🔗 Links

- **Base Mainnet Contract:** [0x...](https://basescan.org/address/0x...)
- **Base Sepolia Contract:** [0x...](https://sepolia.basescan.org/address/0x...)
- **Frontend:** https://your-frontend-url.vercel.app
- **API:** https://your-api-url.com
```

## 🐛 Troubleshooting

### Contract Deployment Fails

- Check you have enough ETH for gas
- Verify RPC URL is correct
- Ensure private key is correct
- Check Basescan API key is valid

### API Can't Connect to Contracts

- Verify contract addresses in `.env` are correct
- Check RPC URL is accessible
- Ensure contracts are deployed on the correct network

### Frontend Can't Connect

- Check WalletConnect Project ID is set
- Verify contract addresses in `.env.local`
- Ensure API URL is correct
- Check network/chain ID matches

## 📚 Next Steps

1. Test all functionality on Sepolia
2. Get community feedback
3. Deploy to Mainnet when ready
4. Share on Twitter with #BuildOnBase
5. Submit to Base Builder Directory

---

**Need help?** Open an issue on GitHub or reach out to the community!

