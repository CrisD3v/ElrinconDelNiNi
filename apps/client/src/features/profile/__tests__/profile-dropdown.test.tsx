import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileDropdown } from '../components/profile-dropdown';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      profile: {
        settings: 'Configuración de perfil',
        favorites: 'Mis Favoritos',
        logout: 'Cerrar sesión',
        badgeReader: 'Lector',
      },
      auth: {
        logoutSuccess: 'Sesión cerrada correctamente',
      },
    };
    return translations[ns]?.[key] || key;
  },
}));

// Mock navigation
const mockPush = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock toast
const mockToastInfo = vi.fn();
const mockToastError = vi.fn();
vi.mock('@/lib/toast', () => ({
  toast: {
    info: (opts: unknown) => mockToastInfo(opts),
    error: (opts: unknown) => mockToastError(opts),
    success: vi.fn(),
  },
}));

// Mock Auth
const mockSignOut = vi.fn().mockResolvedValue(undefined);
const mockProfile = {
  id: 'user-123',
  email: 'reader@example.com',
  displayName: 'NiNi Reader',
  profileImage: null,
  bannerImage: null,
  description: 'Manga lover',
  badges: ['READER'],
  locale: 'es',
  createdAt: '2026-01-01',
};

vi.mock('@/lib/auth/auth-context', () => ({
  useAuth: () => ({
    user: { id: 'user-123', email: 'reader@example.com' },
    profile: mockProfile,
    signOut: mockSignOut,
  }),
}));

describe('ProfileDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger with user display name', () => {
    render(<ProfileDropdown />);
    expect(screen.getByText('NiNi Reader')).toBeInTheDocument();
  });

  it('opens dropdown menu and displays user details and actions', async () => {
    render(<ProfileDropdown />);

    const trigger = screen.getByRole('button');
    fireEvent.pointerDown(trigger, { button: 0, pointerType: 'mouse' });
    fireEvent.click(trigger);

    expect(await screen.findByText('reader@example.com')).toBeInTheDocument();
    expect(screen.getByText('Lector')).toBeInTheDocument();
    expect(screen.getByText('Configuración de perfil')).toBeInTheDocument();
    expect(screen.getByText('Mis Favoritos')).toBeInTheDocument();
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
  });

  it('calls signOut and shows info toast when clicking Cerrar sesión', async () => {
    render(<ProfileDropdown />);

    const trigger = screen.getByRole('button');
    fireEvent.pointerDown(trigger, { button: 0, pointerType: 'mouse' });
    fireEvent.click(trigger);

    const logoutBtn = await screen.findByText('Cerrar sesión');
    fireEvent.click(logoutBtn);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
