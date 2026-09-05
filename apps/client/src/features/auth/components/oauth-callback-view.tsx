'use client';

import {
  MangaPageLoader,
  TornPanelError,
  InkStampSuccess,
  FeedbackCardRoot,
  FeedbackCardVolume,
  FeedbackCardTitle,
  FeedbackCardDescription,
  FeedbackCardActions,
} from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';

export interface OAuthCallbackViewProps {
  status: 'loading' | 'error' | 'success';
  errorMessage?: string | null;
  onRetry?: () => void;
  className?: string;
}

export function OAuthCallbackView({
  status,
  errorMessage,
  onRetry,
  className = '',
}: OAuthCallbackViewProps) {
  return (
    <div className={`min-h-[75vh] flex items-center justify-center px-4 py-12 ${className}`}>
      <FeedbackCardRoot>
        {status === 'loading' && (
          <div className="space-y-6">
            <FeedbackCardVolume>Autenticando</FeedbackCardVolume>
            <MangaPageLoader
              size="lg"
              label="Verificando credenciales..."
              sublabel="Por favor espera un momento"
              showFilament={true}
              showIconBadge={true}
            />
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <FeedbackCardVolume className="text-red-400 border-[#5c2828] bg-[#241717]">
              Error de sesión
            </FeedbackCardVolume>

            <div className="flex justify-center">
              <TornPanelError size="lg" showIconBadge={false} />
            </div>

            <div className="space-y-2">
              <FeedbackCardTitle className="text-red-300">
                Algo salió mal
              </FeedbackCardTitle>
              <FeedbackCardDescription>
                {errorMessage || 'Ocurrió un error inesperado.'}
              </FeedbackCardDescription>
            </div>

            {onRetry && (
              <FeedbackCardActions>
                <Button onClick={onRetry} variant="secondary" className="w-full">
                  Volver al inicio
                </Button>
              </FeedbackCardActions>
            )}

            <p className="text-xs text-text-muted">
              Redirigiendo...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <FeedbackCardVolume className="text-emerald-400 border-[#2b4c34] bg-[#1b221d]">
              Autenticado
            </FeedbackCardVolume>

            <div className="flex justify-center">
              <InkStampSuccess size="lg" showIconBadge={false} />
            </div>

            <div className="space-y-2">
              <FeedbackCardTitle>
                ¡Éxito!
              </FeedbackCardTitle>
              <FeedbackCardDescription>
                Tu sesión ha sido iniciada.
              </FeedbackCardDescription>
            </div>

            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-[#181a19] border border-emerald-500/30 text-xs text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ingresando...</span>
            </div>
          </div>
        )}
      </FeedbackCardRoot>
    </div>
  );
}

