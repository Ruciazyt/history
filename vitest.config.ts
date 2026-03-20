import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Run tests in parallel for better performance
    pool: 'forks',
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    // Better test isolation
    isolate: true,
    // Global test timeout
    testTimeout: 10000,
    // Setup files for jest-dom matchers
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
