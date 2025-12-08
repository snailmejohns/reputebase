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
// Using fewer endpoints to reduce load and improve reliability
const baseSepoliaRpcUrls = [
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
  'https://sepolia.base.org', // Official Base Sepolia RPC (most reliable)
  'https://base-sepolia-rpc.publicnode.com', // PublicNode (backup)
].filter(Boolean);

// Create fallback transport for Base Sepolia
// Simplified approach: use official endpoint first, then fallback
// Increased timeouts and reduced retries to avoid overloading
const baseSepoliaTransport = baseSepoliaRpcUrls.length > 1
  ? fallback(
      baseSepoliaRpcUrls.map((url, index) => {
        console.log(`📡 [RPC] Configuring endpoint ${index + 1}: ${url}`);
        return http(url, {
          retryCount: 0, // No retries - let fallback handle it
          timeout: 20000, // 20 second timeout
          batch: false, // Disable batch to reduce load
        });
      }),
      { 
        rank: false,
        retryCount: 0, // Try each endpoint once
      }
    )
  : http(baseSepoliaRpcUrls[0] || 'https://sepolia.base.org', {
      retryCount: 1, // Single retry for single endpoint
      retryDelay: 1000,
      timeout: 20000,
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

