# ✅ Pre-Deployment Checklist

Use this checklist before deploying ReputeBase to ensure everything is ready.

## 📦 Code & Configuration

### Smart Contracts
- [ ] All contracts compile without errors (`forge build`)
- [ ] All tests pass (`forge test`)
- [ ] Contracts are properly commented (NatSpec)
- [ ] Foundry dependencies installed (`forge install`)
- [ ] OpenZeppelin contracts installed
- [ ] `.env` file configured with:
  - [ ] `PRIVATE_KEY` (deployer wallet)
  - [ ] `BASE_SEPOLIA_RPC_URL`
  - [ ] `BASE_MAINNET_RPC_URL`
  - [ ] `BASESCAN_API_KEY`

### API
- [ ] API dependencies installed (`cd api && npm install`)
- [ ] `.env` file configured (copy from `env.example.api`):
  - [ ] `NETWORK` set to `sepolia` or `mainnet`
  - [ ] RPC URLs configured
  - [ ] Contract addresses (will be filled after deployment)
  - [ ] `PORT` configured
- [ ] API starts without errors (`npm run dev`)
- [ ] Health endpoint works (`GET /health`)

### Frontend
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] `.env.local` file configured (copy from `env.example.frontend`):
  - [ ] `NEXT_PUBLIC_API_URL` set
  - [ ] `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` set (get from [WalletConnect Cloud](https://cloud.walletconnect.com))
  - [ ] `NEXT_PUBLIC_CHAIN_ID` set (84532 for Sepolia, 8453 for Mainnet)
  - [ ] Contract addresses (will be filled after deployment)
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Tailwind CSS configured correctly

### SDK
- [ ] SDK dependencies installed (`cd sdk/js && npm install`)
- [ ] SDK builds without errors (`npm run build`)
- [ ] TypeScript compilation succeeds

## 🧪 Testing

- [ ] All contract tests pass
- [ ] Test coverage is acceptable (>80% recommended)
- [ ] Manual testing of:
  - [ ] Reputation increase/decrease
  - [ ] Badge minting
  - [ ] API endpoints
  - [ ] Frontend wallet connection
  - [ ] Frontend data display

## 📝 Documentation

- [ ] README.md is complete and up-to-date
- [ ] DEPLOYMENT.md is reviewed
- [ ] API documentation is complete
- [ ] SDK documentation is complete
- [ ] Architecture documentation is complete
- [ ] Whitepaper is complete (if applicable)

## 🔐 Security

- [ ] Private keys are NOT committed to git
- [ ] `.env` files are in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] Contracts reviewed for common vulnerabilities
- [ ] Access control is properly implemented

## 🚀 GitHub & CI/CD

- [ ] Repository is public (for Base Rewards)
- [ ] LICENSE file is present (MIT recommended)
- [ ] GitHub Actions workflows are configured:
  - [ ] Test workflow works
  - [ ] Lint workflow works
  - [ ] Deploy workflow is ready (if using)
- [ ] Issues are created for tracking (as per roadmap)
- [ ] Milestones are set up

## 💰 Funding

### For Base Sepolia (Testnet)
- [ ] Have Base Sepolia ETH for gas fees
- [ ] Get from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

### For Base Mainnet
- [ ] Have Base Mainnet ETH for gas fees
- [ ] Have sufficient funds for deployment (estimate: 0.01-0.05 ETH)

## 📋 Pre-Deployment Steps

1. **Test on Local Network First**
   ```bash
   # Start local Anvil node
   anvil
   
   # In another terminal, deploy to local
   forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast
   ```

2. **Deploy to Base Sepolia**
   ```bash
   cd contracts
   forge script script/Deploy.s.sol:DeployScript --rpc-url base_sepolia --broadcast --verify
   ```

3. **Update Configuration**
   - Update API `.env` with contract addresses
   - Update Frontend `.env.local` with contract addresses
   - Test API endpoints
   - Test Frontend functionality

4. **Deploy Frontend**
   - Deploy to Vercel/Netlify
   - Update environment variables in deployment platform
   - Test production frontend

5. **Deploy to Base Mainnet** (only after thorough Sepolia testing)
   ```bash
   cd contracts
   forge script script/Deploy.s.sol:DeployScript --rpc-url base_mainnet --broadcast --verify
   ```

## ✅ Post-Deployment

- [ ] Contracts verified on Basescan
- [ ] Contract addresses added to README.md
- [ ] Frontend URL added to README.md
- [ ] API URL added to README.md
- [ ] Test transactions on deployed contracts
- [ ] Verify all functionality works on mainnet
- [ ] Create Twitter post with #BuildOnBase
- [ ] Share in Base Discord
- [ ] Submit to Base Builder Directory

## 🎯 Base Rewards Requirements

Ensure you meet these criteria for Base Builder Rewards:

- [ ] Deployed to Base Mainnet (chainId 8453)
- [ ] Contracts verified on Basescan
- [ ] Open-source (MIT/Apache-2.0 license)
- [ ] README mentions "Built for Base"
- [ ] README includes chainId (8453)
- [ ] At least 10-20 commits
- [ ] GitHub Issues created and tracked
- [ ] GitHub Actions configured
- [ ] Public repository
- [ ] Documentation complete
- [ ] Working frontend
- [ ] Working API (if applicable)

---

**Ready to deploy?** Follow the [DEPLOYMENT.md](./DEPLOYMENT.md) guide!

