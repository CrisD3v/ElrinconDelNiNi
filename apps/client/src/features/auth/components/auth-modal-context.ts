'use client';

import { createContext, useContext } from 'react';
import type { AuthModalContextValue } from '../types';

export const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModalContext(): AuthModalContextValue {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('AuthModal compound components must be rendered inside <AuthModal.Root>');
  }
  return context;
}
