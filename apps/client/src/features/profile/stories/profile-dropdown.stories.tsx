import type { Meta, StoryObj } from '@storybook/react';
import type { User } from '@supabase/supabase-js';
import { ProfileDropdown } from '../components/profile-dropdown';

const mockUser = {
  id: 'user-123',
  email: 'camilo@ejemplo.com',
  app_metadata: {},
  user_metadata: { full_name: 'Camilo Dev' },
  aud: 'authenticated',
  created_at: '2026-01-01',
} as unknown as User;

const meta = {
  title: 'Features/Profile/ProfileDropdown',
  component: ProfileDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithCustomAvatar: Story = {
  parameters: {
    auth: {
      user: mockUser,
      profile: {
        id: 'user-123',
        email: 'camilo@ejemplo.com',
        displayName: 'Camilo Dev',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bannerImage: null,
        description: 'Amante del Manhwa y desarrollador web.',
        badges: ['Lector VIP'],
        locale: 'es',
        createdAt: '2026-01-01',
      },
    },
  },
};

export const WithDefaultInitials: Story = {
  parameters: {
    auth: {
      user: mockUser,
      profile: {
        id: 'user-123',
        email: 'shin.woo@ejemplo.com',
        displayName: 'Shin Woo',
        profileImage: null,
        bannerImage: null,
        description: null,
        badges: [],
        locale: 'es',
        createdAt: '2026-01-01',
      },
    },
  },
};
