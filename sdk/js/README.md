# ReputeBase JavaScript SDK

JavaScript SDK for interacting with the ReputeBase reputation system.

## Installation

```bash
npm install @reputebase/sdk
```

## Usage

### Basic Setup

```javascript
import ReputeBaseSDK from '@reputebase/sdk';
import { ethers } from 'ethers';

// Initialize SDK
const sdk = new ReputeBaseSDK({
  apiUrl: 'https://api.reputebase.xyz',
  provider: new ethers.JsonRpcProvider('https://mainnet.base.org'),
  reputeCoreAddress: '0x...',
  badgeNFTAddress: '0x...'
});
```

### Get Reputation

```javascript
// Via API
const reputation = await sdk.getReputation('0x...');
console.log(reputation.reputation);

// Via Contract
const rep = await sdk.getReputationFromContract('0x...');
console.log(rep.toString());
```

### Get Badges

```javascript
const badges = await sdk.getBadges('0x...');
console.log(badges.badgeCount);
```

### Update Reputation (requires signer)

```javascript
const signer = new ethers.Wallet(privateKey, provider);
await sdk.increaseReputation(signer, '0x...', ethers.parseEther('10'));
```

## API Reference

See [SDK Documentation](../../docs/sdk.md) for complete API reference.

