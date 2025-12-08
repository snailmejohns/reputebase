import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId } from 'wagmi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseEther, formatEther } from 'viem';
import toast from 'react-hot-toast';

// RPC endpoints list (for logging)
const baseSepoliaRpcUrls = [
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
  'https://sepolia.base.org',
  'https://base-sepolia-rpc.publicnode.com',
  'https://base-sepolia.blockpi.network/v1/rpc/public',
  'https://base-sepolia.drpc.org',
].filter(Boolean);

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
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const [reputation, setReputation] = useState(null);
  const [badges, setBadges] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [earningRep, setEarningRep] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  // Normalize API URL - ensure it has protocol
  const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // If URL doesn't start with http:// or https://, add https://
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      console.warn('⚠️ [API] URL missing protocol, adding https://:', url);
      return `https://${url}`;
    }
    return url;
  };
  
  const API_URL = getApiUrl();

  // Check if contract exists and is accessible
  const { data: contractCode, isLoading: checkingContract } = useReadContract({
    address: TX_VOLUME_MODULE_ADDRESS,
    abi: [{ type: 'function', name: 'reputeCore', inputs: [], outputs: [{ type: 'address' }], stateMutability: 'view' }],
    functionName: 'reputeCore',
    query: {
      enabled: !!TX_VOLUME_MODULE_ADDRESS && isConnected,
      retry: 1,
    },
  });

  const fetchReputation = async (addr) => {
    if (!addr) return;
    
    setLoading(true);
    try {
      // Normalize address (convert to checksum)
      const normalizedAddr = addr.toLowerCase();
      
      console.log('🔍 [API] Fetching reputation:', { API_URL, address: normalizedAddr });
      
      // Check if API URL is valid
      if (!API_URL || API_URL === 'http://localhost:3001') {
        const errorMsg = 'API URL is not configured. Please set NEXT_PUBLIC_API_URL in Vercel environment variables.';
        console.error('❌ [API ERROR]', errorMsg);
        toast.error(errorMsg, { duration: 8000 });
        setLoading(false);
        return;
      }
      
      // Validate URL format
      if (!API_URL.startsWith('http://') && !API_URL.startsWith('https://')) {
        const errorMsg = `Invalid API URL format: ${API_URL}. URL must start with http:// or https://`;
        console.error('❌ [API ERROR]', errorMsg);
        toast.error(errorMsg, { duration: 10000 });
        setLoading(false);
        return;
      }
      
      const [repRes, badgesRes] = await Promise.all([
        axios.get(`${API_URL}/reputation/${normalizedAddr}`, { 
          timeout: 10000,
          validateStatus: (status) => status < 500, // Don't throw on 404
        }),
        axios.get(`${API_URL}/badges/${normalizedAddr}`, { 
          timeout: 10000,
          validateStatus: (status) => status < 500,
        })
      ]);
      
      // Check for 404 or other errors
      if (repRes.status === 404) {
        console.warn('⚠️ [API] 404 - API endpoint not found. Check API URL:', API_URL);
        toast.error(`API endpoint not found (404). Please check NEXT_PUBLIC_API_URL: ${API_URL}`, { duration: 10000 });
        setLoading(false);
        return;
      }
      
      if (repRes.status >= 400) {
        const errorMsg = repRes.data?.error || repRes.data?.message || `API error (${repRes.status})`;
        console.error('❌ [API ERROR]', { status: repRes.status, data: repRes.data });
        toast.error(`API error: ${errorMsg}`, { duration: 8000 });
        setLoading(false);
        return;
      }
      
      console.log('✅ [API] Success:', { reputation: repRes.data, badges: badgesRes.data });
      setReputation(repRes.data);
      setBadges(badgesRes.data);
    } catch (error) {
      console.error('❌ [API ERROR] Full error:', {
        error,
        message: error?.message,
        response: error?.response,
        request: error?.request,
        API_URL,
        address: addr,
      });
      
      let errorMsg = 'Unknown error';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        console.error('❌ [API ERROR] Response:', { status, data });
        
        if (status === 404) {
          // Check if it's a Next.js 404 page (HTML response)
          if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
            errorMsg = `API URL returned 404 page. Please check NEXT_PUBLIC_API_URL: ${API_URL}. Make sure the API is deployed and accessible.`;
          } else {
            errorMsg = `API endpoint not found (404). Check if API is running at ${API_URL}`;
          }
        } else {
          errorMsg = data?.error || data?.message || `Server error (${status})`;
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('❌ [API ERROR] No response:', error.request);
        errorMsg = `Cannot connect to API at ${API_URL}. Please check if the API is running and accessible.`;
      } else {
        // Error setting up request
        console.error('❌ [API ERROR] Setup error:', error.message);
        errorMsg = error.message || 'Failed to fetch reputation';
      }
      
      toast.error(`Failed to fetch reputation: ${errorMsg}`, { duration: 10000 });
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

    // Log debug information
    const debug = {
      timestamp: new Date().toISOString(),
      chainId,
      chainName: chain?.name,
      expectedChainId: 84532, // Base Sepolia
      address,
      contractAddress: TX_VOLUME_MODULE_ADDRESS,
      contractCode: contractCode ? 'exists' : 'not found',
      rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'using fallback endpoints',
    };
    
    console.log('🔍 [DEBUG] Transaction attempt:', debug);
    setDebugInfo(debug);

    // Check if on correct network
    if (chainId !== 84532) {
      const errorMsg = `Wrong network! Please switch to Base Sepolia (Chain ID: 84532). Current: ${chain?.name || chainId}`;
      console.error('❌ [ERROR]', errorMsg);
      toast.error(errorMsg, { id: 'tx-loading', duration: 8000 });
      return;
    }

    // Check if contract exists
    if (!contractCode && !checkingContract) {
      const errorMsg = `Contract not found at ${TX_VOLUME_MODULE_ADDRESS}. Please verify the contract address.`;
      console.error('❌ [ERROR]', errorMsg);
      toast.error(errorMsg, { id: 'tx-loading', duration: 8000 });
      return;
    }

    setEarningRep(true);
    try {
      // Record a test transaction (0.1 ETH = 1 reputation point)
      // In production, this would be called automatically when real transactions happen
      const amount = parseEther('0.1'); // 0.1 ETH
      
      console.log('📝 [INFO] Preparing transaction:', {
        to: TX_VOLUME_MODULE_ADDRESS,
        function: 'recordTransaction',
        args: [address, amount.toString()],
        amount: formatEther(amount),
        chainId,
        network: chain?.name,
      });
      
      toast.loading('Preparing transaction...', { id: 'tx-loading' });
      
      // Add a delay to avoid RPC rate limiting
      // Longer delay for public endpoints
      const delay = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ? 500 : 2000;
      console.log(`⏳ [INFO] Waiting ${delay}ms before transaction to avoid rate limiting...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log('📤 [INFO] Sending transaction...');
      console.log('📡 [RPC] Using endpoints:', baseSepoliaRpcUrls.length, 'available');
      
      await writeContract({
        address: TX_VOLUME_MODULE_ADDRESS,
        abi: TX_VOLUME_MODULE_ABI,
        functionName: 'recordTransaction',
        args: [address, amount],
        gas: undefined, // Let wagmi estimate
      });
      
      console.log('✅ [SUCCESS] Transaction sent, waiting for confirmation...');
    } catch (error) {
      console.error('❌ [ERROR] Transaction failed:', {
        error,
        message: error?.message,
        code: error?.code,
        name: error?.name,
        stack: error?.stack,
        cause: error?.cause,
      });
      
      let errorMessage = error?.message || error?.toString() || 'Unknown error';
      
      // More detailed error messages
      if (error?.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (error?.code === -32603) {
        errorMessage = 'RPC error: Contract execution failed or RPC endpoint unavailable';
      } else if (error?.message?.includes('revert')) {
        errorMessage = `Contract error: ${error.message}`;
      }
      
      toast.error(`Failed to earn reputation: ${errorMessage}`, { id: 'tx-loading', duration: 8000 });
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

  // Handle errors with detailed logging
  useEffect(() => {
    if (writeError || isReceiptError) {
      const error = writeError || receiptError;
      
      console.error('❌ [ERROR] Transaction error details:', {
        error,
        message: error?.message,
        code: error?.code,
        name: error?.name,
        shortMessage: error?.shortMessage,
        cause: error?.cause,
        data: error?.data,
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        chainId,
        address,
        contractAddress: TX_VOLUME_MODULE_ADDRESS,
      });
      
      let errorMsg = error?.message || error?.shortMessage || 'Unknown error';
      
      // Provide user-friendly error messages
      if (errorMsg.includes('RPC endpoint') || errorMsg.includes('too many errors') || errorMsg.includes('Requested resource not available')) {
        errorMsg = 'RPC endpoint is temporarily unavailable. The app will automatically try other endpoints. Please wait a few seconds and try again.';
        console.warn('⚠️ [WARN] RPC endpoint issue - will retry with fallback');
      } else if (errorMsg.includes('User rejected') || errorMsg.includes('user rejected') || error?.code === 4001) {
        errorMsg = 'Transaction was cancelled by user';
      } else if (errorMsg.includes('insufficient funds') || errorMsg.includes('insufficient balance')) {
        errorMsg = 'Insufficient funds for transaction. Please add more ETH to your wallet.';
      } else if (errorMsg.includes('network') || errorMsg.includes('Network')) {
        errorMsg = 'Network error. Please check your connection and try again.';
      } else if (errorMsg.includes('timeout') || errorMsg.includes('Timeout')) {
        errorMsg = 'Request timed out. Please try again.';
      } else if (errorMsg.includes('revert') || error?.code === -32603) {
        errorMsg = `Contract execution failed: ${errorMsg}`;
      }
      
      toast.error(`Transaction failed: ${errorMsg}`, { id: 'tx-loading', duration: 8000 });
      setEarningRep(false);
    }
  }, [writeError, isReceiptError, chainId, address]);

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

        {/* Debug Info (Development only) */}
        {debugInfo && process.env.NODE_ENV === 'development' && (
          <section className="mb-4 p-4 bg-gray-800 rounded-lg text-left text-xs">
            <h3 className="font-bold mb-2 text-yellow-400">🔍 Debug Info:</h3>
            <pre className="text-gray-300 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </section>
        )}

        {/* Network Warning */}
        {isConnected && chainId !== 84532 && (
          <section className="mb-4 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg">
            <p className="text-yellow-200">
              ⚠️ Wrong network! Please switch to <strong>Base Sepolia</strong> (Chain ID: 84532)
            </p>
            <p className="text-yellow-300 text-sm mt-1">
              Current: {chain?.name || `Chain ID ${chainId}`}
            </p>
          </section>
        )}

        {/* Contract Status */}
        {isConnected && (
          <section className="mb-4 p-4 bg-blue-900/50 border border-blue-600 rounded-lg">
            <p className="text-blue-200">
              📋 Contract: {TX_VOLUME_MODULE_ADDRESS}
            </p>
            <p className="text-blue-300 text-sm mt-1">
              Status: {checkingContract ? 'Checking...' : (contractCode ? '✅ Found' : '❌ Not found')}
            </p>
          </section>
        )}

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

