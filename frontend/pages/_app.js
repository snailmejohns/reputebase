import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { http, fallback } from 'wagmi';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

// Define local Anvil chain for development
const anvil = {
  id: 31337,
  name: 'Anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
};

// Base Sepolia RPC URLs with fallbacks (free public endpoints)
// Priority: custom URL > official Base > public nodes
const baseSepoliaRpcUrls = [
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
  'https://sepolia.base.org', // Official Base Sepolia RPC
  'https://base-sepolia-rpc.publicnode.com', // PublicNode (free)
  'https://base-sepolia.blockpi.network/v1/rpc/public', // BlockPI (free)
  'https://base-sepolia.gateway.tenderly.co', // Tenderly (free)
  'https://base-sepolia.drpc.org', // dRPC (free)
].filter(Boolean);

// Create fallback transport for Base Sepolia
// Use fallback to automatically switch between endpoints if one fails
// Disable batch multicall to reduce RPC load
const baseSepoliaTransport = baseSepoliaRpcUrls.length > 1
  ? fallback(
      baseSepoliaRpcUrls.map((url, index) => http(url, {
        // First endpoint (custom or official) gets more retries
        retryCount: index === 0 ? 2 : 1,
        retryDelay: index === 0 ? 500 : 300,
        timeout: 15000, // Increased timeout for public endpoints
        // Disable batch to reduce load on free endpoints
        batch: false,
      })),
      { 
        rank: false, // Don't rank endpoints, try in order
        retryCount: 1, // Retry once with next endpoint
      }
    )
  : http(baseSepoliaRpcUrls[0] || 'https://sepolia.base.org', {
      retryCount: 3,
      retryDelay: 500,
      timeout: 15000,
      batch: false,
    });

const config = getDefaultConfig({
  appName: 'ReputeBase',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [anvil, baseSepolia, base],
  transports: {
    [anvil.id]: http('http://localhost:8545'),
    [baseSepolia.id]: baseSepoliaTransport,
    [base.id]: http(),
  },
  ssr: true,
  locale: 'en', // Force English language
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  
  return (
    <>
      {/* Google Analytics */}
      {gaId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
      
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider locale="en">
            <Component {...pageProps} />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default MyApp;

