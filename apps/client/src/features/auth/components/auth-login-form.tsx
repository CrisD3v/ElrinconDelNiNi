'use client';

import { useTranslations } from 'next-intl';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthModalContext } from './auth-modal-context';
import type { AuthLoginFormProps } from '../types';

export function AuthLoginForm({ className = '' }: AuthLoginFormProps) {
  const t = useTranslations('auth');
  const {
    handleLoginSubmit,
    getEmailInputProps,
    getPasswordInputProps,
    getSubmitProps,
    showPassword,
    setShowPassword,
    loading,
  } = useAuthModalContext();

  return (
    <form onSubmit={handleLoginSubmit} className={`space-y-4 mt-2 ${className}`}>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-secondary">
          {t('emailLabel')}
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            {...getEmailInputProps({
              className: `
                w-full pl-10 pr-4 py-2.5 bg-[#121314] border border-[#3e4242] rounded-xl
                text-sm text-text-primary placeholder:text-text-muted/60
                focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
                transition-colors
              `,
            })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-secondary">
          {t('passwordLabel')}
        </label>
        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            {...getPasswordInputProps({
              className: `
                w-full pl-10 pr-10 py-2.5 bg-[#121314] border border-[#3e4242] rounded-xl
                text-sm text-text-primary placeholder:text-text-muted/60
                focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
                transition-colors
              `,
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? t('hidePassword') : t('showPassword')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <Button
        {...getSubmitProps({
          className:
            'w-full py-2.5 font-bold shadow-md shadow-black/40 hover:shadow-accent/25 transition-all cursor-pointer',
        })}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />
            <span>{t('loading')}</span>
          </>
        ) : (
          t('submitLogin')
        )}
      </Button>
    </form>
  );
}
