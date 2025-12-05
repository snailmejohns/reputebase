# ReputeBase Architecture

## Overview

ReputeBase is built with a modular architecture that allows for extensibility and composability.

## Components

### Smart Contracts

#### ReputeCore.sol
- Core reputation management contract
- Tracks reputation per user
- Manages registered modules
- Emits events for reputation updates

#### BadgeNFT.sol
- ERC-721 contract for achievement badges
- Automatically mints badges at reputation milestones
- Supports Bronze, Silver, Gold, and Legendary badges

#### Modules
- **TxVolumeModule**: Tracks reputation based on transaction volume
- **SocialModule** (planned): Tracks social interactions
- **QuestModule** (planned): Tracks quest completions

### API Layer

REST API built with Express.js that provides:
- Reputation queries
- Badge queries
- Event posting

### Frontend

Next.js application with:
- Wallet connection (RainbowKit)
- Reputation dashboard
- Badge gallery
- API playground

### SDK

JavaScript SDK for easy integration:
- API client
- Contract interaction helpers
- TypeScript support

## Data Flow

```
User Action → Module → ReputeCore → BadgeNFT
                ↓
            API Layer
                ↓
            Frontend/SDK
```

## Security Considerations

- Only registered modules can update reputation
- Badge minting requires reputation threshold
- Owner-controlled module registration
- OpenZeppelin contracts for security

