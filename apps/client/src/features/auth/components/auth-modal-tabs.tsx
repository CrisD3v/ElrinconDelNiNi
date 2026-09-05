'use client';

import { useTranslations } from 'next-intl';
import { useAuthModalContext } from './auth-modal-context';
import type { AuthModalTabsProps } from '../types';

export function AuthModalTabs({ className = '' }: AuthModalTabsProps) {
  const t = useTranslations('auth');
  const { activeTab, getTabProps } = useAuthModalContext();

  return (
    <div
      role="tablist"
      aria-label={t('authModalAria')}
      className={`grid grid-cols-2 p-1 bg-[#121314] rounded-xl border border-[#3e4242] mt-2 ${className}`}
    >
      <button
        {...getTabProps('login', {
          className: `
            relative py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2
            ${
              activeTab === 'login'
                ? 'bg-[#1f2121] text-accent shadow-sm border border-accent/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-[#18191a]/60 border border-transparent'
            }
          `,
        })}
      >
        {activeTab === 'login' && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        )}
        <span>{t('loginTab')}</span>
      </button>
      <button
        {...getTabProps('register', {
          className: `
            relative py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2
            ${
              activeTab === 'register'
                ? 'bg-[#1f2121] text-accent shadow-sm border border-accent/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-[#18191a]/60 border border-transparent'
            }
          `,
        })}
      >
        {activeTab === 'register' && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        )}
        <span>{t('registerTab')}</span>
      </button>
    </div>
  );
}
