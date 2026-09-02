import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock next-intl routing
vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, className, ...props }: any) => {
    return React.createElement('a', { href, className, ...props }, children as React.ReactNode);
  },
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  redirect: vi.fn(),
}));

// Mock next-intl hooks
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'es',
  NextIntlClientProvider: ({ children }: any) => children,
}));

// Mock animejs to prevent issues in jsdom
vi.mock('animejs', () => ({
  animate: vi.fn(() => ({
    pause: vi.fn(),
    play: vi.fn(),
  })),
  default: vi.fn(),
}));
