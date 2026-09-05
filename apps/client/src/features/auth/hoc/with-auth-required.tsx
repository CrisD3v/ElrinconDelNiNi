'use client';

import React, { ComponentType, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth/auth-context';
import { Loader } from '@/components/ui/loader';
import { AuthModal } from '../components/auth-modal';

export interface WithAuthRequiredOptions {
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Higher-Order Component (HOC) ensuring the wrapped view requires an authenticated session.
 */
export function withAuthRequired<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthRequiredOptions = {}
) {
  return function AuthenticatedComponent(props: P) {
    const t = useTranslations('auth');
    const { user, isLoading } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);

    if (isLoading) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader label={t('verifyingSession')} />
        </div>
      );
    }

    if (!user) {
      if (options.fallback) {
        return <>{options.fallback}</>;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h2 className="text-xl font-bold text-text-primary">{t('restrictedAccessTitle')}</h2>
          <p className="text-sm text-text-secondary max-w-sm">
            {t('restrictedAccessDesc')}
          </p>
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
