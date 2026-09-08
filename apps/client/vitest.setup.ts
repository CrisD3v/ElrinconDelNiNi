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
  Link: ({
    children,
    href,
    className,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => {
    return React.createElement('a', { href, className, ...props }, children);
  },
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  redirect: vi.fn(),
}));

// Mock next-intl hooks
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'es',
  useFormatter: () => ({
    relativeTime: () => 'hace 5m',
    dateTime: () => '10/10/2023',
  }),
  NextIntlClientProvider: ({ children }: { children?: React.ReactNode }) => children,
}));

// Mock animejs to prevent issues in jsdom
vi.mock('animejs', () => ({
  animate: vi.fn(() => ({
    pause: vi.fn(),
    play: vi.fn(),
  })),
  default: vi.fn(),
}));

// Mock window.matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
