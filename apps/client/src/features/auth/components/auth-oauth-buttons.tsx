'use client';

import { useTranslations } from 'next-intl';
import { useAuthModalContext } from './auth-modal-context';
import type { AuthOAuthButtonsProps } from '../types';

export function AuthOAuthButtons({ className = '' }: AuthOAuthButtonsProps) {
  const t = useTranslations('auth');
  const { handleOAuth, loading } = useAuthModalContext();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#2e3131]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#18191a] px-3 text-[11px] font-semibold tracking-wider text-text-muted uppercase">
            {t('orContinueWith')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          disabled={loading}
          className="
            flex items-center justify-center gap-2.5 py-2.5 px-3
            bg-[#121314] border border-[#3e4242] rounded-xl text-xs sm:text-sm font-medium
            text-text-secondary hover:text-text-primary hover:bg-[#1f2121] hover:border-accent/40
            transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm
          "
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.2 7.5 23 12 23z"
            />
          </svg>
          <span className="truncate">{t('continueWithGoogle')}</span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuth('discord')}
          disabled={loading}
          className="
            flex items-center justify-center gap-2.5 py-2.5 px-3
            bg-[#121314] border border-[#3e4242] rounded-xl text-xs sm:text-sm font-medium
            text-text-secondary hover:text-text-primary hover:bg-[#1f2121] hover:border-accent/40
            transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm
          "
        >
          <svg className="w-4 h-4 fill-[#5865F2] shrink-0" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          <span className="truncate">{t('continueWithDiscord')}</span>
        </button>
      </div>
    </div>
  );
}
