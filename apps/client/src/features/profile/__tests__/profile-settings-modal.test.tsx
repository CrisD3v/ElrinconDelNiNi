import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileSettingsModal } from '../components/profile-settings-modal';
import { AuthContext, type AuthContextType } from '@/lib/auth/auth-context';
import type { User } from '@supabase/supabase-js';
import type { UserMe } from '@elrincondelnini/types';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      volumeBadge: 'PERFIL · EXPEDIENTE',
      editTitle: 'Editar Perfil',
      editSubtitle: 'Personaliza tu imagen, portada y datos de tu cuenta',
      bannerUpload: 'Cambiar portada',
      bannerRemove: 'Quitar portada',
      bannerHint: 'JPG, PNG, WEBP o GIF animado (máx. 5MB)',
      noBannerAssigned: 'Sin portada asignada',
      bannerAlt: 'Banner de perfil',
      avatarUpload: 'Cambiar foto',
      uploadHint: 'Formatos JPG, PNG o WEBP (máx. 5MB)',
      nameLabel: 'Nombre de usuario',
      namePlaceholder: 'Tu nombre o apodo',
      bioLabel: 'Biografía',
      bioPlaceholder: 'Cuéntanos sobre ti...',
      cancel: 'Cancelar',
      save: 'Guardar cambios',
      saving: 'Guardando...',
    };
    return translations[key] || key;
  },
}));

const mockProfile: UserMe = {
  id: 'user-123',
  email: 'camilo@ejemplo.com',
  displayName: 'Camilo Dev',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
  description: 'Apasionado por la lectura de manhwa.',
  badges: ['Lector'],
  locale: 'es',
  createdAt: '2026-01-01',
};

const mockUser = {
  id: 'user-123',
  email: 'camilo@ejemplo.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2026-01-01',
} as unknown as User;

const mockAuthValue: AuthContextType = {
  user: mockUser,
  session: null,
  profile: mockProfile,
  isLoading: false,
  signInWithPassword: vi.fn(),
  signUpWithPassword: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  updateUserProfile: vi.fn().mockResolvedValue(mockProfile),
  refreshProfile: vi.fn(),
};

describe('ProfileSettingsModal', () => {
  it('renders modal with banner preview and overlapped avatar', () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <ProfileSettingsModal isOpen={true} onClose={vi.fn()} />
      </AuthContext.Provider>
    );

    // Verify Title & Micro-badge
    expect(screen.getByText('PERFIL · EXPEDIENTE')).toBeInTheDocument();
    expect(screen.getByText('Editar Perfil')).toBeInTheDocument();

    // Verify Banner Image exists
    const bannerImg = screen.getByAltText('Banner de perfil');
    expect(bannerImg).toBeInTheDocument();
    expect(bannerImg).toHaveAttribute('src', mockProfile.bannerImage);

    // Verify Upload Buttons
    expect(screen.getByText('Cambiar portada')).toBeInTheDocument();
    expect(screen.getByText('Cambiar foto')).toBeInTheDocument();

    // Verify Form Fields
    expect(screen.getByDisplayValue('Camilo Dev')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Apasionado por la lectura de manhwa.')).toBeInTheDocument();
  });

  it('renders default empty banner state when profile has no banner', () => {
    const profileWithoutBanner: UserMe = {
      ...mockProfile,
      bannerImage: null,
    };

    render(
      <AuthContext.Provider value={{ ...mockAuthValue, profile: profileWithoutBanner }}>
        <ProfileSettingsModal isOpen={true} onClose={vi.fn()} />
      </AuthContext.Provider>
    );

    expect(screen.queryByAltText('Banner de perfil')).not.toBeInTheDocument();
    expect(screen.getByText('Sin portada asignada')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <ProfileSettingsModal isOpen={false} onClose={vi.fn()} />
      </AuthContext.Provider>
    );

    expect(screen.queryByText('Editar Perfil')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking the Cancel button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <AuthContext.Provider value={mockAuthValue}>
        <ProfileSettingsModal isOpen={true} onClose={onClose} />
      </AuthContext.Provider>
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });
});
