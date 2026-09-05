import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { User } from '@supabase/supabase-js';
import type { UserMe } from '@elrincondelnini/types';
import { ProfileSettingsModal } from '../components/profile-settings-modal';
import { Button } from '@/components/ui/button';

// Mock profile with animated GIF banner
const mockProfileWithGif: UserMe = {
  id: 'user-123',
  email: 'camilo@ejemplo.com',
  displayName: 'Camilo Dev',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bannerImage: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHJvbXJia29pM3RocGkxdmtvZms2OGw0eDF5dGdxenN2d3M2dzRvaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/B2vBunhgt9Pc4/giphy.gif',
  description: 'Apasionado por la lectura de manhwa, manga y novelas ligeras en El Rincón del NiNi.',
  badges: ['Lector'],
  locale: 'es',
  createdAt: '2026-01-01',
};

// Mock profile with static image banner
const mockProfileWithStatic: UserMe = {
  ...mockProfileWithGif,
  bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
};

// Mock profile without banner (default texture)
const mockProfileWithoutBanner: UserMe = {
  ...mockProfileWithGif,
  bannerImage: null,
};

const meta = {
  title: 'Features/Profile/ProfileSettingsModal',
  component: ProfileSettingsModal,
  args: {
    isOpen: true,
    onClose: () => {},
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileSettingsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

function ProfileSettingsStoryWrapper({ profileData }: { profileData: UserMe }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="p-6">
      <Button onClick={() => setIsOpen(true)} variant="primary">
        Abrir Configuración de Perfil
      </Button>
      <ProfileSettingsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        profile={profileData}
      />
    </div>
  );
}

/**
 * Modal de perfil con Banner en formato GIF animado en vivo y avatar solapado.
 */
export const WithAnimatedGifBanner: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
  parameters: {
    auth: {
      user: { id: 'user-123', email: 'camilo@ejemplo.com' } as unknown as User,
      profile: mockProfileWithGif,
    },
  },
  render: () => <ProfileSettingsStoryWrapper profileData={mockProfileWithGif} />,
};

/**
 * Modal de perfil con Banner en formato imagen estática de alta resolución.
 */
export const WithStaticImageBanner: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
  parameters: {
    auth: {
      user: { id: 'user-123', email: 'camilo@ejemplo.com' } as unknown as User,
      profile: mockProfileWithStatic,
    },
  },
  render: () => <ProfileSettingsStoryWrapper profileData={mockProfileWithStatic} />,
};

/**
 * Modal de perfil inicial sin banner asignado (muestra textura screentone manga y botón de carga).
 */
export const WithoutBanner: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
  parameters: {
    auth: {
      user: { id: 'user-123', email: 'camilo@ejemplo.com' } as unknown as User,
      profile: mockProfileWithoutBanner,
    },
  },
  render: () => <ProfileSettingsStoryWrapper profileData={mockProfileWithoutBanner} />,
};
