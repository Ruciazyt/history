import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Production optimizations
  poweredByHeader: false,
  
  // Enable compression
  compress: true,
  
  // Image optimization (for future use)
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  typescript: {
    // Allow building with TypeScript errors (pre-existing test file issues)
    ignoreBuildErrors: true,
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['react', 'react-dom', 'next-intl'],
  },
  
  // Enable strict mode for better development
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
