import { ReactNode, ComponentPropsWithoutRef } from 'react';

export type AuthTab = 'login' | 'register';

export interface AuthModalState {
  isOpen: boolean;
  activeTab: AuthTab;
  loading: boolean;
  errorMessage: string | null;
  reset: () => void;
  setTab: (tab: AuthTab) => void;
}

export interface AuthModalProps {
  /** Uncontrolled initial open state (State Initializer) */
  defaultOpen?: boolean;
  /** Controlled open state (Control Props) */
  isOpen?: boolean;
  /** Callback for open state change */
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled initial tab (State Initializer) */
  defaultTab?: AuthTab;
  /** Controlled tab (Control Props) */
  tab?: AuthTab;
  /** Callback for tab change */
  onTabChange?: (tab: AuthTab) => void;
  /** Custom children or Render Prop: (state) => ReactNode */
  children?: ReactNode | ((state: AuthModalState) => ReactNode);
  className?: string;
}

export interface AuthModalContextValue extends AuthModalState {
  closeModal: () => void;
  getTabProps: (tab: AuthTab, props?: ComponentPropsWithoutRef<'button'>) => ComponentPropsWithoutRef<'button'>;
  getEmailInputProps: (props?: ComponentPropsWithoutRef<'input'>) => ComponentPropsWithoutRef<'input'>;
  getPasswordInputProps: (props?: ComponentPropsWithoutRef<'input'>) => ComponentPropsWithoutRef<'input'>;
  getSubmitProps: (props?: ComponentPropsWithoutRef<'button'>) => ComponentPropsWithoutRef<'button'>;
  // Form values & handlers
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  displayName: string;
  setDisplayName: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  handleLoginSubmit: (e: React.FormEvent) => Promise<void>;
  handleRegisterSubmit: (e: React.FormEvent) => Promise<void>;
  handleOAuth: (provider: 'google' | 'discord') => Promise<void>;
}

export interface AuthLoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export interface AuthRegisterFormProps {
  onSuccess?: () => void;
  className?: string;
}

export interface AuthOAuthButtonsProps {
  className?: string;
}

export interface AuthModalTabsProps {
  className?: string;
}
