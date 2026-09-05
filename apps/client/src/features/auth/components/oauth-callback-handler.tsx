'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/lib/toast';
import { supabase } from '@/lib/supabase/client';

import { OAuthCallbackView } from './oauth-callback-view';

export function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function handleAuth() {
      try {
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          const msg = errorDescription || error;
          if (!isCancelled) {
            setStatus('error');
            setErrorMessage(msg);
          }
          toast.error({
            title: 'Error de Autenticación',
            description: msg,
          });
          setTimeout(() => router.replace('/'), 3000);
          return;
        }

        const code = searchParams.get('code');

        if (code) {
          // Exchange authorization code for session (PKCE)
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
        } else {
          // Check if session is already present or from hash
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          if (!session) {
            // Give Supabase a brief moment to parse hash if present
            await new Promise((resolve) => setTimeout(resolve, 800));
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (!retrySession) {
              throw new Error('No se encontraron credenciales de sesión');
            }
          }
        }

        if (!isCancelled) {
          setStatus('success');
        }

        toast.success({
          title: '¡Bienvenido!',
          description: 'Sesión iniciada correctamente.',
        });

        const next = searchParams.get('next') || '/';
        setTimeout(() => router.replace(next), 600);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al procesar el inicio de sesión.';
        if (!isCancelled) {
          setStatus('error');
          setErrorMessage(message);
        }
        toast.error({
          title: 'Error de Autenticación',
          description: message,
        });
        setTimeout(() => router.replace('/'), 3500);
      }
    }

    handleAuth();

    return () => {
      isCancelled = true;
    };
  }, [router, searchParams]);

  return (
    <OAuthCallbackView
      status={status}
      errorMessage={errorMessage}
      onRetry={() => router.replace('/')}
    />
  );
}


