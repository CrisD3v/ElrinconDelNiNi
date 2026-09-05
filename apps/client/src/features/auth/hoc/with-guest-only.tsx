'use client';

import React, { ComponentType } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Loader } from '@/components/ui/loader';

/**
 * Higher-Order Component (HOC) ensuring only unauthenticated guests see the wrapped view.
 */
export function withGuestOnly<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback: React.ReactNode = null
) {
  return function GuestComponent(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-[200px] flex items-center justify-center">
          <Loader />
        </div>
      );
    }

    if (user) {
      return <>{fallback}</>;
    }

    return <WrappedComponent {...props} />;
  };
}
