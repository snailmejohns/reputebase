# 🏆 ReputeBase

> **Reputation is the new identity.**

[![Built for Base](https://img.shields.io/badge/Built%20for-Base-0052FF?style=flat-square&logo=base)](https://base.org)
[![Deployed on Base](https://img.shields.io/badge/Deployed%20on-Base%20Mainnet-0052FF?style=flat-square)](https://basescan.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**ReputeBase** is a modular reputation and identity layer for the Base ecosystem. It enables dApps to build on-chain reputation systems, issue achievement badges, and create composable identity primitives.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

ReputeBase provides a decentralized reputation infrastructure that allows:

- ✅ **On-chain reputation tracking** — Attach reputation scores to user addresses
- ✅ **Modular system** — Extend functionality through custom modules
- ✅ **Achievement NFTs** — Automatically mint badges based on reputation milestones
- ✅ **Public API** — Query reputation data for any address
- ✅ **SDK integration** — Easy integration for dApps and developers

### Why Base?

ReputeBase is built specifically for **Base** (Chain ID: `8453` for Mainnet, `84532` for Sepolia) to support the growing ecosystem's need for identity and reputation primitives. This aligns with Base's focus on:

- 🔐 **Identity** — Building on-chain identity infrastructure
- 👥 **Social** — Enabling social graph and reputation systems
- 🛠️ **Utility** — Providing reusable building blocks
- 🌐 **Open-source** — Contributing to public goods

---

## ✨ Features

### Core Functionality

- **Reputation Management**
  - Increase/decrease reputation scores
  - Query reputation for any address
  - Event-based reputation updates

- **Modular Architecture**
  - Plugin system for custom reputation modules
  - Examples: Transaction Volume, Social Interactions, Quest Completion
  - Easy to extend and customize

- **Achievement Badges (ERC-721)**
  - Automatic badge minting at reputation milestones
  - Bronze (100 rep), Silver (1,000 rep), Gold (10,000 rep), Legendary
  - Transferable NFT badges

- **Developer Tools**
  - REST API for reputation queries
  - JavaScript SDK for easy integration
  - Python SDK (optional)
  - Comprehensive documentation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      ReputeBase System                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ ReputeCore   │◄───│   Modules    │───►│  BadgeNFT    │  │
│  │  Contract    │    │   System     │    │  Contract    │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                    │          │
│         │                   │                    │          │
│  ┌──────▼───────────────────▼────────────────────▼──────┐  │
│  │              REST API Layer                           │  │
│  └──────┬───────────────────────────────────────────────┘  │
│         │                                                    │
│  ┌──────▼───────────────────────────────────────────────┐  │
│  │              Frontend Dashboard (Next.js)              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              SDK (JS / Python)                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Smart Contracts

- **ReputeCore.sol** — Core reputation management contract
- **BadgeNFT.sol** — ERC-721 contract for achievement badges
- **Modules/** — Custom reputation modules (TxVolume, Social, Quest, etc.)

### Components

- **API** — REST API for querying reputation data
- **Frontend** — Next.js dashboard for viewing reputation and badges
- **SDK** — JavaScript and Python SDKs for integration

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥18.x
- Foundry (for smart contracts)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/reputebase.git
cd reputebase

# Install dependencies
npm install

# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Smart Contracts

```bash
cd contracts

# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test

# Deploy to Base Sepolia
forge script script/Deploy.s.sol:DeployScript --rpc-url $BASE_SEPOLIA_RPC --broadcast --verify
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### API

```bash
cd api

# Install dependencies
npm install

# Run development server
npm run dev

# The API will be available at http://localhost:3001
```

### SDK

```bash
cd sdk/js

# Install dependencies
npm install

# Build
npm run build

# Publish (when ready)
npm publish
```

---

## 📚 Documentation

- [Setup Guide](./SETUP.md) — Local development setup
- [Deployment Guide](./DEPLOYMENT.md) — How to deploy to Base
- [Pre-Deployment Checklist](./PRE_DEPLOYMENT_CHECKLIST.md) — Checklist before deploying
- [Whitepaper](./docs/whitepaper.md) — Complete protocol documentation
- [API Documentation](./docs/api.md) — REST API reference
- [SDK Documentation](./docs/sdk.md) — SDK usage guide
- [Architecture](./docs/architecture.md) — Detailed architecture overview

---

## 🗺️ Roadmap

### Phase 1: MVP (1-2 weeks) ✅

- [x] ReputeCore V1 contract
- [x] TxVolumeModule implementation
- [x] BadgeNFT V1 contract
- [x] Basic REST API
- [x] Basic frontend dashboard
- [x] README and documentation
- [ ] Deploy to Base Sepolia
- [ ] GitHub Actions (tests, lint)

### Phase 2: Full Release (2-3 weeks)

- [ ] 3+ modules (Social, Quest, Holdings)
- [ ] Polished Dashboard with Tailwind
- [ ] JS SDK release
- [ ] Deploy to Base Mainnet
- [ ] Enhanced API with event indexing
- [ ] Comprehensive test coverage (>80%)
- [ ] Examples folder
- [ ] Whitepaper

### Phase 3: Ecosystem Expansion (ongoing)

- [ ] PR contributions to Base open-source projects
- [ ] Integration with Base Name Service
- [ ] Integration with other Base dApps
- [ ] Community feedback and improvements
- [ ] Governance mechanism (optional)

---

## 🔗 Links

### Base Sepolia (Testnet)
- **ReputeCore:** [0xF0E6165E409DB7C7e665c6a7cb34e71983fDF224](https://sepolia.basescan.org/address/0xF0E6165E409DB7C7e665c6a7cb34e71983fDF224)
- **BadgeNFT:** [0x3BF942e76cC4d59C75f8CA340556117D000C4FC7](https://sepolia.basescan.org/address/0x3BF942e76cC4d59C75f8CA340556117D000C4FC7)
- **TxVolumeModule:** [0x5d7683Ab887849543ae32287c26ac9da40423342](https://sepolia.basescan.org/address/0x5d7683Ab887849543ae32287c26ac9da40423342)

### Base Mainnet
- **Coming Soon** - Deploy after thorough testing on Sepolia

### Services
- **Frontend:** [Coming Soon](https://reputebase.xyz)
- **API:** [Coming Soon](https://api.reputebase.xyz)
- **Documentation:** [docs.reputebase.xyz](https://docs.reputebase.xyz)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

Quick start:
```bash
# Install all dependencies
npm run install:all

# Run contract tests
npm run test:contracts

# Start API
npm run dev:api

# Start Frontend
npm run dev:frontend
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built for [Base](https://base.org) ecosystem
- Inspired by Lens Protocol, Farcaster, and other identity/reputation systems
- Special thanks to the Base community and builders

---

## 📧 Contact

- **Twitter:** [@reputebase](https://twitter.com/reputebase)
- **Discord:** [Base Builders Discord](https://discord.gg/base)
- **Email:** contact@reputebase.xyz

---

**Built with ❤️ for Base**

*Reputation is the new identity.*

