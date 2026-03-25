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
    // Type checking is handled by tsc --noEmit in CI; Next build stays fast
    ignoreBuildErrors: false,
  },

  // Turbopack root for monorepo (suppresses lockfile conflict warning)
  turbopack: {
    root: __dirname,
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['react', 'react-dom', 'next-intl'],
  },
  
  // Enable strict mode for better development
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
