# ReputeBase SDK Documentation

## Installation

```bash
npm install @reputebase/sdk
```

## Usage

### Initialization

```typescript
import ReputeBaseSDK from '@reputebase/sdk';
import { ethers } from 'ethers';

const sdk = new ReputeBaseSDK({
  apiUrl: 'https://api.reputebase.xyz',
  provider: new ethers.JsonRpcProvider('https://mainnet.base.org'),
  reputeCoreAddress: '0x...',
  badgeNFTAddress: '0x...'
});
```

## Methods

### getReputation(address: string)

Get reputation data via API.

```typescript
const data = await sdk.getReputation('0x...');
console.log(data.reputation);
```

### getBadges(address: string)

Get badges for an address.

```typescript
const badges = await sdk.getBadges('0x...');
console.log(badges.badgeCount);
```

### getReputationFromContract(address: string)

Get reputation directly from contract.

```typescript
const rep = await sdk.getReputationFromContract('0x...');
```

### increaseReputation(signer, user, amount)

Increase reputation (requires signer).

```typescript
await sdk.increaseReputation(signer, '0x...', ethers.parseEther('10'));
```

