import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { http, fallback } from 'wagmi';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';
import Head from 'next/head';

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
// More endpoints for better reliability
const customRpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL;

// Log RPC configuration on client side
if (typeof window !== 'undefined') {
  console.log('📡 [RPC CONFIG] Custom RPC URL:', customRpcUrl ? '✅ Set' : '❌ Not set');
  if (customRpcUrl) {
    console.log('📡 [RPC CONFIG] Using custom RPC:', customRpcUrl);
  } else {
    console.warn('⚠️ [RPC CONFIG] No custom RPC set, will use public endpoints');
  }
}

const baseSepoliaRpcUrls = [
  customRpcUrl,
  'https://sepolia.base.org', // Official Base Sepolia RPC (most reliable)
  'https://base-sepolia-rpc.publicnode.com', // PublicNode
  'https://base-sepolia.blockpi.network/v1/rpc/public', // BlockPI
  'https://base-sepolia.drpc.org', // dRPC
].filter(Boolean);

if (typeof window !== 'undefined') {
  console.log('📡 [RPC CONFIG] Total endpoints:', baseSepoliaRpcUrls.length);
  baseSepoliaRpcUrls.forEach((url, i) => {
    console.log(`📡 [RPC CONFIG] Endpoint ${i + 1}: ${url?.substring(0, 50)}...`);
  });
}

// Create fallback transport for Base Sepolia
// If custom RPC is set, use it primarily with minimal fallback
// If no custom RPC, use multiple public endpoints
const baseSepoliaTransport = customRpcUrl
  ? // Custom RPC mode: use custom first, with one fallback
    fallback(
        [
          http(customRpcUrl, {
            retryCount: 2, // Retry custom RPC multiple times
            retryDelay: 1000,
            timeout: 30000,
            batch: false,
          }),
          // Only add official Base as fallback
          http('https://sepolia.base.org', {
            retryCount: 1,
            timeout: 30000,
            batch: false,
          }),
        ],
        {
          rank: false,
          retryCount: 1, // Try fallback once if custom fails
        }
      )
  : // Public endpoints mode: use multiple endpoints
    baseSepoliaRpcUrls.length > 1
    ? fallback(
        baseSepoliaRpcUrls.map((url, index) => {
          if (typeof window !== 'undefined') {
            console.log(`📡 [RPC] Configuring endpoint ${index + 1}/${baseSepoliaRpcUrls.length}: ${url?.substring(0, 50)}...`);
          }
          return http(url, {
            retryCount: 0, // No individual retries - let fallback handle it
            timeout: 30000, // 30 second timeout for public endpoints
            batch: false, // Disable batch to reduce load
          });
        }),
        { 
          rank: false, // Try endpoints in order
          retryCount: 2, // Try up to 2 times with different endpoints
        }
      )
    : http(baseSepoliaRpcUrls[0] || 'https://sepolia.base.org', {
        retryCount: 2, // Multiple retries for single endpoint
        retryDelay: 2000, // 2 second delay between retries
        timeout: 30000,
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
      <Head>
        {/* Base App Verification Meta Tag */}
        <meta name="base:app_id" content="694bcf314d3a403912ed7dfb" />
      </Head>
      
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

