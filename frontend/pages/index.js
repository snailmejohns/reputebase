import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';

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
        const errorMsg = error.response.data.error || error.response.data.message || 'Unknown error';
        toast.error(`Failed to fetch reputation: ${errorMsg}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('Failed to connect to API. Please check if the API is running.');
      } else {
        console.error('Error:', error.message);
        toast.error(`Failed to fetch reputation: ${error.message}`);
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
      toast.error('Please connect your wallet first');
      return;
    }

    setEarningRep(true);
    try {
      // Record a test transaction (0.1 ETH = 1 reputation point)
      // In production, this would be called automatically when real transactions happen
      const amount = parseEther('0.1'); // 0.1 ETH
      
      toast.loading('Preparing transaction...', { id: 'tx-loading' });
      
      await writeContract({
        address: TX_VOLUME_MODULE_ADDRESS,
        abi: TX_VOLUME_MODULE_ABI,
        functionName: 'recordTransaction',
        args: [address, amount],
      });
    } catch (error) {
      console.error('Error earning reputation:', error);
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      toast.error(`Failed to earn reputation: ${errorMessage}`, { id: 'tx-loading' });
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
      toast.success('Transaction confirmed! Reputation updated.', { id: 'tx-loading' });
      setTimeout(() => {
        fetchReputation(address);
        setEarningRep(false);
      }, 2000);
    }
  }, [isSuccess, address]);

  // Handle transaction status
  useEffect(() => {
    if (isWriting) {
      toast.loading('Waiting for wallet confirmation...', { id: 'tx-loading' });
    } else if (isConfirming) {
      toast.loading('Transaction confirming...', { id: 'tx-loading' });
    }
  }, [isWriting, isConfirming]);

  // Handle errors
  useEffect(() => {
    if (writeError || isReceiptError) {
      const error = writeError || receiptError;
      console.error('Transaction error:', error);
      const errorMsg = error?.message || 'Unknown error';
      toast.error(`Transaction failed: ${errorMsg}`, { id: 'tx-loading' });
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
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">ReputeBase</h1>
            <p className="text-blue-300 text-sm sm:text-base">Reputation is the new identity</p>
          </div>
          <div className="w-full sm:w-auto">
            <ConnectButton />
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
            Decentralized Identity & Reputation Layer for Base
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Build on-chain reputation, earn achievement badges, and create composable identity primitives
          </p>
        </section>

        {/* Dashboard Section */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Reputation Dashboard</h3>
          
          {/* Search/Connect */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter address or connect wallet"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 text-sm sm:text-base"
            />
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-base-blue text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : 'Search'}
              </button>
              {isConnected && (
                <button
                  onClick={handleConnect}
                  className="px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 text-sm sm:text-base whitespace-nowrap"
                >
                  My Address
                </button>
              )}
            </div>
          </div>

          {/* Reputation Display */}
          {loading && !reputation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-2"></div>
                <div className="h-10 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
              <div className="bg-white/5 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-2"></div>
                <div className="h-10 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ) : reputation ? (
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
          ) : null}

          {/* Earn Reputation Button */}
          {isConnected && address && (
            <div className="mb-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <h4 className="text-lg font-semibold text-white mb-2">Earn Reputation</h4>
              <p className="text-sm text-gray-300 mb-4">
                Record a test transaction to earn reputation points. 
                Each 0.1 ETH transaction = 1 reputation point (for testing).
              </p>
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <button
                  onClick={earnReputation}
                  disabled={isWriting || isConfirming || earningRep}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {(isWriting || isConfirming || earningRep) && (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isWriting ? 'Waiting for wallet...' : isConfirming ? 'Confirming...' : isSuccess ? 'Success! Refreshing...' : 'Earn 1 Reputation (Test)'}
                </button>
                {(isWriting || isConfirming || earningRep) && (
                  <button
                    onClick={resetTransactionState}
                    className="w-full sm:w-auto px-4 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
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

