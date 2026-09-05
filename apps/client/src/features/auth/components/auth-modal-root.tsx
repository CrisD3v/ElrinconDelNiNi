'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuthModal } from '../hooks/use-auth-modal';
import { AuthModalContext } from './auth-modal-context';
import { AuthModalTabs } from './auth-modal-tabs';
import { AuthLoginForm } from './auth-login-form';
import { AuthRegisterForm } from './auth-register-form';
import { AuthOAuthButtons } from './auth-oauth-buttons';
import type { AuthModalProps } from '../types';

export function AuthModalRoot(props: AuthModalProps) {
  const { children, className = '' } = props;
  const t = useTranslations('auth');
  const modalContext = useAuthModal(props);
  const { isOpen, closeModal, activeTab, setTab, errorMessage } = modalContext;

  return (
    <AuthModalContext.Provider value={modalContext}>
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent
          className={`max-w-md border-[#3e4242] bg-[#18191a] text-text-primary p-6 sm:p-7 space-y-4 shadow-2xl shadow-black rounded-2xl animate-in fade-in-0 duration-200 ${className}`}
        >
          {/* Decorative Manga Panel Corner Brackets */}
          <div
            data-testid="corner-tl"
            aria-hidden="true"
            className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-accent/60 rounded-tl-[2px] pointer-events-none z-30"
          />
          <div
            data-testid="corner-tr"
            aria-hidden="true"
            className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-accent/60 rounded-tr-[2px] pointer-events-none z-30"
          />
          <div
            data-testid="corner-bl"
            aria-hidden="true"
            className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-accent/60 rounded-bl-[2px] pointer-events-none z-30"
          />
          <div
            data-testid="corner-br"
            aria-hidden="true"
            className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-accent/60 rounded-br-[2px] pointer-events-none z-30"
          />

          <DialogHeader className="space-y-1 text-center pt-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-center text-text-primary">
              {activeTab === 'login' ? t('loginTitle') : t('registerTitle')}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-center text-text-secondary max-w-xs mx-auto">
              {activeTab === 'login' ? t('loginSubtitle') : t('registerSubtitle')}
            </DialogDescription>
          </DialogHeader>

            {/* Render Props Pattern: Allow children as function */}
            {typeof children === 'function' ? (
              children(modalContext)
            ) : children ? (
              children
            ) : (
              /* Default Compound Composition */
              <>
                <AuthModalTabs />

                {/* Rustic Crimson Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 p-3 text-xs rounded-xl bg-[#241717] border border-[#5c2828] text-red-300 animate-in fade-in-50 duration-200"
                  >
                    <AlertTriangle size={15} className="text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {activeTab === 'login' ? <AuthLoginForm /> : <AuthRegisterForm />}

                <AuthOAuthButtons />

                {/* Footer switch */}
                <div className="text-center pt-2">
                  {activeTab === 'login' ? (
                    <p className="text-xs text-text-secondary">
                      {t('noAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => setTab('register')}
                        className="text-accent hover:text-accent-hover font-semibold transition-colors cursor-pointer"
                      >
                        {t('registerTab')}
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-text-secondary">
                      {t('haveAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => setTab('login')}
                        className="text-accent hover:text-accent-hover font-semibold transition-colors cursor-pointer"
                      >
                        {t('loginTab')}
                      </button>
                    </p>
                  )}
                </div>
              </>
            )}
        </DialogContent>
      </Dialog>
    </AuthModalContext.Provider>
  );
}
