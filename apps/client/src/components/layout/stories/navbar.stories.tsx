import type { Meta, StoryObj } from '@storybook/react';
import type { User } from '@supabase/supabase-js';
import { Navbar } from '../navbar';

const meta = {
  title: 'Layout/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GuestState: Story = {
  parameters: {
    auth: {
      user: null,
      profile: null,
      isLoading: false,
    },
  },
  render: () => (
    <div className="min-h-[200px] bg-dark-950 pt-20 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto text-center text-text-muted py-12">
        Contenido de la página de inicio (Vista Invitado con botón Iniciar Sesión)
      </div>
    </div>
  ),
};

export const AuthenticatedState: Story = {
  parameters: {
    auth: {
      user: { id: 'u1', email: 'sung.jinwoo@solo.com' } as unknown as User,
      profile: {
        id: 'u1',
        email: 'sung.jinwoo@solo.com',
        displayName: 'Sung Jinwoo',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bannerImage: null,
        description: 'Monarca de las sombras.',
        badges: ['Lector'],
        locale: 'es',
        createdAt: '2026-01-01',
      },
      isLoading: false,
    },
  },
  render: () => (
    <div className="min-h-[200px] bg-dark-950 pt-20 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto text-center text-text-muted py-12">
        Contenido de la página de inicio (Vista Autenticado con Avatar y Perfil Dropdown)
      </div>
    </div>
  ),
};
