import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa'; // Import next-pwa

// Initialize next-pwa
const withPWA = withPWAInit({
  dest: 'public', // Destination directory for PWA files
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  register: true, // Register the service worker
  // You can add more PWA options here if needed
  // See: https://github.com/shadowwalker/next-pwa#configuration-options
});

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

// Wrap your config with withPWA
export default withPWA(nextConfig);
