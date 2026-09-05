// Components
export {
  AuthModal,
  AuthModalRoot,
  AuthModalTabs,
  AuthLoginForm,
  AuthRegisterForm,
  AuthOAuthButtons,
} from './components/auth-modal';
export { OAuthCallbackHandler } from './components/oauth-callback-handler';
export { OAuthCallbackView, type OAuthCallbackViewProps } from './components/oauth-callback-view';

// Hooks
export { useAuthModal } from './hooks/use-auth-modal';

// HOCs
export { withAuthRequired } from './hoc/with-auth-required';
export { withGuestOnly } from './hoc/with-guest-only';

// Types
export type {
  AuthTab,
  AuthModalState,
  AuthModalProps,
  AuthLoginFormProps,
  AuthRegisterFormProps,
  AuthOAuthButtonsProps,
  AuthModalTabsProps,
} from './types';
