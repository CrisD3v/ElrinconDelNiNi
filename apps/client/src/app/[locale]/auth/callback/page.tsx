'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { OAuthCallbackHandler } from '@/components/layout/oauth-callback-handler';

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      }
    >
      <OAuthCallbackHandler />
    </Suspense>
  );
}
