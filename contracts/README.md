# ReputeBase Smart Contracts

Smart contracts for the ReputeBase reputation system.

## Setup

### Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Install Dependencies

```bash
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

### Compile

```bash
forge build
```

### Test

```bash
forge test
```

### Deploy

Set environment variables:
```bash
export PRIVATE_KEY=your_private_key
export BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
export BASESCAN_API_KEY=your_api_key
```

Deploy to Base Sepolia:
```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url base_sepolia --broadcast --verify
```

## Contracts

- **ReputeCore.sol**: Core reputation management
- **BadgeNFT.sol**: Achievement badge NFTs
- **TxVolumeModule.sol**: Transaction volume reputation module

## Testing

Run all tests:
```bash
forge test -vvv
```

Run specific test:
```bash
forge test --match-contract ReputeCoreTest
```

