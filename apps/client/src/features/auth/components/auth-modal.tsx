'use client';

import { AuthModalRoot } from './auth-modal-root';
import { AuthModalTabs } from './auth-modal-tabs';
import { AuthLoginForm } from './auth-login-form';
import { AuthRegisterForm } from './auth-register-form';
import { AuthOAuthButtons } from './auth-oauth-buttons';

/**
 * AuthModal Compound Component
 *
 * Can be used as a standalone drop-in:
 * `<AuthModal isOpen={isOpen} onClose={handleClose} />`
 *
 * Or composed via subcomponents:
 * ```tsx
 * <AuthModal.Root isOpen={isOpen} onClose={handleClose}>
 *   <AuthModal.Tabs />
 *   <AuthModal.LoginForm />
 *   <AuthModal.OAuthButtons />
 * </AuthModal.Root>
 * ```
 *
 * Or customized via Render Props:
 * ```tsx
 * <AuthModal.Root isOpen={isOpen} onClose={handleClose}>
 *   {({ activeTab, loading }) => (...)}
 * </AuthModal.Root>
 * ```
 */
export const AuthModal = Object.assign(AuthModalRoot, {
  Root: AuthModalRoot,
  Tabs: AuthModalTabs,
  LoginForm: AuthLoginForm,
  RegisterForm: AuthRegisterForm,
  OAuthButtons: AuthOAuthButtons,
});

export {
  AuthModalRoot,
  AuthModalTabs,
  AuthLoginForm,
  AuthRegisterForm,
  AuthOAuthButtons,
};
