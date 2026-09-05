import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthModal } from '../components/auth-modal';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      loginTab: 'Iniciar Sesión',
      registerTab: 'Registrarse',
      loginTitle: 'Bienvenido de nuevo',
      loginSubtitle: 'Ingresa a tu cuenta para continuar',
      registerTitle: 'Crear una cuenta',
      registerSubtitle: 'Únete a la comunidad',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'tu@correo.com',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: '••••••••',
      nameLabel: 'Nombre de usuario',
      namePlaceholder: 'Tu nombre o apodo',
      submitLogin: 'Iniciar Sesión',
      submitRegister: 'Crear Cuenta',
      orContinueWith: 'o continúa con',
      continueWithGoogle: 'Google',
      continueWithDiscord: 'Discord',
      noAccount: '¿No tienes una cuenta?',
      haveAccount: '¿Ya tienes una cuenta?',
    };
    return translations[key] || key;
  },
}));

// Mock auth context
vi.mock('@/lib/auth/auth-context', () => ({
  useAuth: () => ({
    user: null,
    session: null,
    profile: null,
    isLoading: false,
    signInWithPassword: vi.fn(),
    signUpWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    refreshProfile: vi.fn(),
    updateUserProfile: vi.fn(),
  }),
}));

describe('AuthModal (Compound Component & Patterns)', () => {
  it('renders login form by default when open', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@correo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Discord')).toBeInTheDocument();
  });

  it('switches to register tab when clicking register', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);

    const registerTabs = screen.getAllByRole('tab', { name: 'Registrarse' });
    fireEvent.click(registerTabs[0]);

    expect(screen.getByText('Crear una cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu nombre o apodo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear Cuenta' })).toBeInTheDocument();
  });

  it('supports Compound Component composition explicitly', () => {
    render(
      <AuthModal.Root isOpen={true} onClose={vi.fn()}>
        <AuthModal.Tabs />
        <AuthModal.LoginForm />
      </AuthModal.Root>
    );

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@correo.com')).toBeInTheDocument();
  });

  it('supports Render Props pattern', () => {
    render(
      <AuthModal.Root isOpen={true} onClose={vi.fn()}>
        {({ activeTab, setTab }) => (
          <div>
            <span data-testid="active-tab">{activeTab}</span>
            <button onClick={() => setTab('register')} data-testid="change-tab-btn">
              Go Register
            </button>
          </div>
        )}
      </AuthModal.Root>
    );

    expect(screen.getByTestId('active-tab')).toHaveTextContent('login');
    fireEvent.click(screen.getByTestId('change-tab-btn'));
    expect(screen.getByTestId('active-tab')).toHaveTextContent('register');
  });

  it('supports Control Props pattern for active tab', () => {
    const handleTabChange = vi.fn();
    const { rerender } = render(
      <AuthModal isOpen={true} tab="login" onTabChange={handleTabChange} />
    );
    expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument();

    rerender(<AuthModal isOpen={true} tab="register" onTabChange={handleTabChange} />);
    expect(screen.getByText('Crear una cuenta')).toBeInTheDocument();
  });

  it('renders decorative manga panel corner brackets in compact modal', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByTestId('corner-tl')).toBeInTheDocument();
    expect(screen.getByTestId('corner-tr')).toBeInTheDocument();
    expect(screen.getByTestId('corner-bl')).toBeInTheDocument();
    expect(screen.getByTestId('corner-br')).toBeInTheDocument();
  });
});
