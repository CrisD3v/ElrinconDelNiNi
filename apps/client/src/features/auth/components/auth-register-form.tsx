'use client';

import { useTranslations } from 'next-intl';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthModalContext } from './auth-modal-context';
import type { AuthRegisterFormProps } from '../types';

export function AuthRegisterForm({ className = '' }: AuthRegisterFormProps) {
  const t = useTranslations('auth');
  const {
    handleRegisterSubmit,
    displayName,
    setDisplayName,
    getEmailInputProps,
    getPasswordInputProps,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    getSubmitProps,
    loading,
  } = useAuthModalContext();

  return (
    <form onSubmit={handleRegisterSubmit} className={`space-y-4 mt-2 ${className}`}>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-secondary">
          {t('nameLabel')}
        </label>
        <div className="relative">
          <User
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            required
            placeholder={t('namePlaceholder')}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2.5 bg-[#121314] border border-[#3e4242] rounded-xl
              text-sm text-text-primary placeholder:text-text-muted/60
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
              transition-colors
            "
          />
        </div>
      </div>

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

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-secondary">
          {t('confirmPasswordLabel') || 'Confirmar contraseña'}
        </label>
        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder={t('confirmPasswordPlaceholder') || 'Confirmar contraseña'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2.5 bg-[#121314] border border-[#3e4242] rounded-xl
              text-sm text-text-primary placeholder:text-text-muted/60
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
              transition-colors
            "
          />
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
          t('submitRegister')
        )}
      </Button>
    </form>
  );
}
