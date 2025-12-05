/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_REPUTE_CORE_ADDRESS: process.env.NEXT_PUBLIC_REPUTE_CORE_ADDRESS,
    NEXT_PUBLIC_BADGE_NFT_ADDRESS: process.env.NEXT_PUBLIC_BADGE_NFT_ADDRESS,
  },
  webpack: (config, { isServer }) => {
    // Ignore react-native modules in webpack
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig

