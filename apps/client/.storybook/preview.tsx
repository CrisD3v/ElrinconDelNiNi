import type { Preview } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import type { UserMe } from '@elrincondelnini/types';
import { AuthContext } from '../src/lib/auth/auth-context';
import messages from '../src/i18n/messages/es.json';
import '../src/app/globals.css';

// Global process polyfill for browser/Vite in Storybook
if (typeof window !== 'undefined') {
  const win = window as unknown as { process?: { env?: Record<string, string> } };
  win.process = win.process || { env: {} };
  win.process.env = {
    NEXT_PUBLIC_API_URL: 'http://localhost:3001',
    NEXT_PUBLIC_SUPABASE_URL: 'https://vyowfhvbqffklhibqqmv.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5b3dmaHZicWZma2xoaWJxcW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDgyNjIsImV4cCI6MjEwMzcyNDI2Mn0.VOIQBD-3uJJWIK-FO5RiYBsZHdIFIAQFgdHE5tpG2xM',
    ...(win.process.env || {}),
  };
}

const defaultMockAuth = {
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  signInWithPassword: async () => ({ error: null }),
  signUpWithPassword: async () => ({ error: null, user: null }),
  signInWithOAuth: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
  updateUserProfile: async () => ({} as unknown as UserMe),
};

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#08080a' },
        { name: 'elevated', value: '#121217' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const authParams = context.parameters?.auth;
      const authValue = authParams
        ? { ...defaultMockAuth, ...authParams }
        : defaultMockAuth;

      return (
        <NextIntlClientProvider locale="es" messages={messages}>
          <AuthContext.Provider value={authValue}>
            <div className="bg-background min-h-screen text-text-primary p-4 antialiased">
              <Story />
            </div>
          </AuthContext.Provider>
        </NextIntlClientProvider>
      );
    },
  ],
};

export default preview;
