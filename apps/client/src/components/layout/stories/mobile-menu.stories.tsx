import type { Meta, StoryObj } from '@storybook/react';
import type { User } from '@supabase/supabase-js';
import { MobileMenu } from '../mobile-menu';

const meta = {
  title: 'Layout/MobileMenu',
  component: MobileMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MobileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GuestUser: Story = {
  parameters: {
    auth: {
      user: null,
      profile: null,
    },
  },
};

export const AuthenticatedUser: Story = {
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
        badges: ['Lector VIP'],
        locale: 'es',
        createdAt: '2026-01-01',
      },
    },
  },
};
