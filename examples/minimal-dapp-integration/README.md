# Minimal dApp Integration Example

This example shows how to integrate ReputeBase into your dApp.

## Installation

```bash
npm install @reputebase/sdk ethers
```

## Basic Integration

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

// Get user reputation
const reputation = await sdk.getReputation(userAddress);
console.log(`User reputation: ${reputation.reputation}`);

// Display badges
const badges = await sdk.getBadges(userAddress);
console.log(`User has ${badges.badgeCount} badges`);
```

## React Example

```jsx
import { useEffect, useState } from 'react';
import ReputeBaseSDK from '@reputebase/sdk';

function UserReputation({ address }) {
  const [reputation, setReputation] = useState(null);
  const sdk = new ReputeBaseSDK({ apiUrl: 'https://api.reputebase.xyz' });

  useEffect(() => {
    sdk.getReputation(address).then(setReputation);
  }, [address]);

  if (!reputation) return <div>Loading...</div>;

  return (
    <div>
      <h3>Reputation: {reputation.reputation}</h3>
      <p>Total: {reputation.totalReputation}</p>
    </div>
  );
}
```

