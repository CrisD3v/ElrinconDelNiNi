import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  async viteFinal(config) {
    return {
      ...config,
      define: {
        ...config.define,
        'process.env': JSON.stringify({
          NEXT_PUBLIC_API_URL: 'http://localhost:3001',
          NEXT_PUBLIC_SUPABASE_URL: 'https://vyowfhvbqffklhibqqmv.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5b3dmaHZicWZma2xoaWJxcW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDgyNjIsImV4cCI6MjEwMzcyNDI2Mn0.VOIQBD-3uJJWIK-FO5RiYBsZHdIFIAQFgdHE5tpG2xM',
        }),
        'process.env.NEXT_PUBLIC_API_URL': JSON.stringify('http://localhost:3001'),
        'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify('https://vyowfhvbqffklhibqqmv.supabase.co'),
        'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5b3dmaHZicWZma2xoaWJxcW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDgyNjIsImV4cCI6MjEwMzcyNDI2Mn0.VOIQBD-3uJJWIK-FO5RiYBsZHdIFIAQFgdHE5tpG2xM'),
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@': path.resolve(__dirname, '../src'),
          'next/navigation': path.resolve(__dirname, './mocks/next-navigation.tsx'),
          '@/i18n/navigation': path.resolve(__dirname, './mocks/i18n-navigation.tsx'),
          'next/image': path.resolve(__dirname, './mocks/next-image.tsx'),
        },
      },
    };
  },
};
export default config;
