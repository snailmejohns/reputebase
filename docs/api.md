# ReputeBase API Documentation

## Base URL

```
https://api.reputebase.xyz
```

## Endpoints

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T12:00:00.000Z"
}
```

### GET /reputation/:address

Get reputation data for an address.

**Parameters:**
- `address` (path) - Ethereum address

**Response:**
```json
{
  "address": "0x...",
  "reputation": "1000",
  "totalReputation": "1500",
  "moduleCount": "3",
  "timestamp": "2025-01-27T12:00:00.000Z"
}
```

### GET /badges/:address

Get badges for an address.

**Parameters:**
- `address` (path) - Ethereum address

**Response:**
```json
{
  "address": "0x...",
  "badgeCount": 2,
  "badges": [
    {
      "tokenId": "1",
      "tokenURI": "https://api.reputebase.xyz/badges/bronze.json"
    }
  ],
  "timestamp": "2025-01-27T12:00:00.000Z"
}
```

### POST /events/onchain

Post an onchain event (for future use).

**Request Body:**
```json
{
  "address": "0x...",
  "eventType": "transaction",
  "data": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event received",
  "timestamp": "2025-01-27T12:00:00.000Z"
}
```

