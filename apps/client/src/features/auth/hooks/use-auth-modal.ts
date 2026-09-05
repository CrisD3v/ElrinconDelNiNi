'use client';

import { useState, useCallback, ComponentPropsWithoutRef, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from '@/lib/toast';
import type { AuthTab, AuthModalProps, AuthModalContextValue } from '../types';

export function useAuthModal(props: AuthModalProps = {}): AuthModalContextValue {
  const {
    defaultOpen = false,
    isOpen: controlledOpen,
    onClose,
    onOpenChange,
    defaultTab = 'login',
    tab: controlledTab,
    onTabChange,
  } = props;

  const t = useTranslations('auth');
  const { signInWithPassword, signUpWithPassword, signInWithOAuth } = useAuth();

  // State Initializer: defaultTab / defaultOpen
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const [internalTab, setInternalTab] = useState<AuthTab>(defaultTab);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Control Props logic
  const isControlledOpen = typeof controlledOpen === 'boolean';
  const isOpen = isControlledOpen ? controlledOpen : internalOpen;

  const isControlledTab = typeof controlledTab === 'string';
  const activeTab = isControlledTab ? controlledTab : internalTab;

  const setTab = useCallback(
    (newTab: AuthTab) => {
      setErrorMessage(null);
      if (!isControlledTab) {
        setInternalTab(newTab);
      }
      onTabChange?.(newTab);
    },
    [isControlledTab, onTabChange]
  );

  const closeModal = useCallback(() => {
    if (!isControlledOpen) {
      setInternalOpen(false);
    }
    onClose?.();
    onOpenChange?.(false);
  }, [isControlledOpen, onClose, onOpenChange]);

  // State Initializer: Reset back to pristine state
  const reset = useCallback(() => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setConfirmPassword('');
    setShowPassword(false);
    setLoading(false);
    setErrorMessage(null);
    if (!isControlledTab) {
      setInternalTab(defaultTab);
    }
  }, [defaultTab, isControlledTab]);

  // Submit handlers
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage(t('missingFields'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await signInWithPassword(email, password);
      if (error) {
        setErrorMessage(t('invalidCredentials'));
        toast.error({
          title: t('loginError'),
          description: error.message,
        });
      } else {
        toast.success({
          title: t('loginSuccess'),
          description: email,
        });
        reset();
        closeModal();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('unexpectedError');
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password || !displayName) {
      setErrorMessage(t('missingFields'));
      return;
    }

    if (password.length < 6) {
      setErrorMessage(t('passwordLength'));
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setErrorMessage(t('passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUpWithPassword(email, password, displayName);
      if (error) {
        setErrorMessage(error.message);
        toast.error({
          title: t('registerError'),
          description: error.message,
        });
      } else {
        toast.success({
          title: t('registerSuccess'),
          description: t('checkEmail'),
        });
        reset();
        closeModal();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('unexpectedError');
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'discord') => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        setErrorMessage(error.message);
        toast.error({
          title: t('oauthErrorTitle'),
          description: error.message,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('oauthConnectError');
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // Props Getters Pattern: Compose props, ARIA and handlers without overriding
  const getTabProps = useCallback(
    (tab: AuthTab, userProps: ComponentPropsWithoutRef<'button'> = {}) => ({
      type: 'button' as const,
      role: 'tab',
      'aria-selected': activeTab === tab,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        userProps.onClick?.(e);
        if (!e.defaultPrevented) {
          setTab(tab);
        }
      },
      ...userProps,
    }),
    [activeTab, setTab]
  );

  const getEmailInputProps = useCallback(
    (userProps: ComponentPropsWithoutRef<'input'> = {}) => ({
      type: 'email',
      required: true,
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        userProps.onChange?.(e);
        if (!e.defaultPrevented) {
          setEmail(e.target.value);
        }
      },
      placeholder: t('emailPlaceholder') || 'correo@ejemplo.com',
      ...userProps,
    }),
    [email, t]
  );

  const getPasswordInputProps = useCallback(
    (userProps: ComponentPropsWithoutRef<'input'> = {}) => ({
      type: showPassword ? 'text' : 'password',
      required: true,
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        userProps.onChange?.(e);
        if (!e.defaultPrevented) {
          setPassword(e.target.value);
        }
      },
      placeholder: t('passwordPlaceholder') || '••••••••',
      ...userProps,
    }),
    [password, showPassword, t]
  );

  const getSubmitProps = useCallback(
    (userProps: ComponentPropsWithoutRef<'button'> = {}) => ({
      type: 'submit' as const,
      disabled: loading,
      ...userProps,
    }),
    [loading]
  );

  return {
    isOpen,
    activeTab,
    loading,
    errorMessage,
    reset,
    setTab,
    closeModal,
    getTabProps,
    getEmailInputProps,
    getPasswordInputProps,
    getSubmitProps,
    email,
    setEmail,
    password,
    setPassword,
    displayName,
    setDisplayName,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    handleLoginSubmit,
    handleRegisterSubmit,
    handleOAuth,
  };
}
