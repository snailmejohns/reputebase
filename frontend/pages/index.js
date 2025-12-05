import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseEther } from 'viem';

// Contract addresses (from deployment)
// Base Sepolia: 0x5d7683Ab887849543ae32287c26ac9da40423342
// Local Anvil: 0x39a2C6Ae37a3E6C7f5a7C8a3fEa9C1Cd725BD8Aa
const TX_VOLUME_MODULE_ADDRESS = process.env.NEXT_PUBLIC_TX_VOLUME_MODULE_ADDRESS || '0x5d7683Ab887849543ae32287c26ac9da40423342';

// ABI for TxVolumeModule
const TX_VOLUME_MODULE_ABI = [
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'recordTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [reputation, setReputation] = useState(null);
  const [badges, setBadges] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [earningRep, setEarningRep] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchReputation = async (addr) => {
    if (!addr) return;
    
    setLoading(true);
    try {
      // Normalize address (convert to checksum)
      const normalizedAddr = addr.toLowerCase();
      
      const [repRes, badgesRes] = await Promise.all([
        axios.get(`${API_URL}/reputation/${normalizedAddr}`),
        axios.get(`${API_URL}/badges/${normalizedAddr}`)
      ]);
      
      setReputation(repRes.data);
      setBadges(badgesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('API URL:', API_URL);
      console.error('Address:', addr);
      if (error.response) {
        console.error('Response error:', error.response.data);
        alert(`Failed to fetch reputation: ${error.response.data.error || error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Failed to connect to API. Make sure API is running on http://localhost:3001');
      } else {
        console.error('Error:', error.message);
        alert(`Failed to fetch reputation: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchAddress) {
      fetchReputation(searchAddress);
    }
  };

  const handleConnect = () => {
    if (isConnected && address) {
      setSearchAddress(address);
      fetchReputation(address);
    }
  };

  // Function to earn reputation by recording a transaction
  const { writeContract, data: hash, isPending: isWriting, error: writeError, reset: resetWrite } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });

  const earnReputation = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    setEarningRep(true);
    try {
      // Record a test transaction (0.1 ETH = 1 reputation point)
      // In production, this would be called automatically when real transactions happen
      const amount = parseEther('0.1'); // 0.1 ETH
      
      await writeContract({
        address: TX_VOLUME_MODULE_ADDRESS,
        abi: TX_VOLUME_MODULE_ABI,
        functionName: 'recordTransaction',
        args: [address, amount],
      });
    } catch (error) {
      console.error('Error earning reputation:', error);
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      alert(`Failed to earn reputation: ${errorMessage}`);
      setEarningRep(false);
    }
  };

  // Reset state function
  const resetTransactionState = () => {
    setEarningRep(false);
    resetWrite();
  };

  // Refresh reputation after successful transaction
  useEffect(() => {
    if (isSuccess && address) {
      setTimeout(() => {
        fetchReputation(address);
        setEarningRep(false);
      }, 2000);
    }
  }, [isSuccess, address]);

  // Handle errors
  useEffect(() => {
    if (writeError || isReceiptError) {
      const error = writeError || receiptError;
      console.error('Transaction error:', error);
      alert(`Transaction failed: ${error?.message || 'Unknown error'}`);
      setEarningRep(false);
    }
  }, [writeError, isReceiptError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-dark to-blue-900">
      <Head>
        <title>ReputeBase - Decentralized Identity & Reputation Layer</title>
        <meta name="description" content="Reputation is the new identity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">ReputeBase</h1>
            <p className="text-blue-300">Reputation is the new identity</p>
          </div>
          <ConnectButton />
        </header>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Decentralized Identity & Reputation Layer for Base
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Build on-chain reputation, earn achievement badges, and create composable identity primitives
          </p>
        </section>

        {/* Dashboard Section */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Reputation Dashboard</h3>
          
          {/* Search/Connect */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter address or connect wallet"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-base-blue text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
            {isConnected && (
              <button
                onClick={handleConnect}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Use My Address
              </button>
            )}
          </div>

          {/* Reputation Display */}
          {reputation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-300 mb-2">Reputation</h4>
                <p className="text-3xl font-bold text-white">{reputation.reputation}</p>
                <p className="text-sm text-gray-400 mt-2">Total: {reputation.totalReputation}</p>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-300 mb-2">Modules</h4>
                <p className="text-3xl font-bold text-white">{reputation.moduleCount}</p>
                <p className="text-sm text-gray-400 mt-2">Active modules</p>
              </div>
            </div>
          )}

          {/* Earn Reputation Button */}
          {isConnected && address && (
            <div className="mb-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <h4 className="text-lg font-semibold text-white mb-2">Earn Reputation</h4>
              <p className="text-sm text-gray-300 mb-4">
                Record a test transaction to earn reputation points. 
                Each 0.1 ETH transaction = 1 reputation point (for testing).
              </p>
              <div className="flex gap-2 items-center">
                <button
                  onClick={earnReputation}
                  disabled={isWriting || isConfirming || earningRep}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWriting ? 'Waiting for wallet...' : isConfirming ? 'Confirming...' : isSuccess ? 'Success! Refreshing...' : 'Earn 1 Reputation (Test)'}
                </button>
                {(isWriting || isConfirming || earningRep) && (
                  <button
                    onClick={resetTransactionState}
                    className="px-4 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {isSuccess && (
                <p className="text-green-400 text-sm mt-2">✅ Transaction confirmed! Reputation updated.</p>
              )}
              {(writeError || isReceiptError) && (
                <p className="text-red-400 text-sm mt-2">
                  ❌ Transaction failed: {(writeError || receiptError)?.message || 'Unknown error'}
                </p>
              )}
              {hash && !isSuccess && !isReceiptError && (
                <p className="text-blue-400 text-sm mt-2">
                  Transaction hash: {hash.substring(0, 10)}...{hash.substring(hash.length - 8)}
                </p>
              )}
            </div>
          )}

          {/* Badges Display */}
          {badges && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Badges ({badges.badgeCount})</h4>
              {badges.badgeCount > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges.badges.map((badge, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="w-16 h-16 bg-base-blue rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <p className="text-sm text-gray-300">Token #{badge.tokenId}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No badges yet. Build your reputation to earn badges!</p>
              )}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">Modular System</h3>
            <p className="text-gray-300">Extend functionality through custom reputation modules</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">Achievement Badges</h3>
            <p className="text-gray-300">Earn NFT badges based on reputation milestones</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">Public API</h3>
            <p className="text-gray-300">Query reputation data for any address</p>
          </div>
        </section>
      </main>

      <footer className="text-center py-8 text-gray-400">
        <p>Built for Base • Reputation is the new identity</p>
      </footer>
    </div>
  );
}

