import type { Meta, StoryObj } from '@storybook/react';
import { UserHoverCard } from '../components/user-hover-card';
import type { User } from '@elrincondelnini/types';

const mockUser: User = {
  id: 'user-1',
  username: 'ninja_master',
  displayName: 'Ninja Master',
  profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&h=200&fit=crop',
  description: 'Anime lover and manga reader. Learning the ways of the shinobi.',
  badges: ['PRO', 'MODERATOR'],
  email: 'ninja@example.com',
  supabaseId: 'supa-1',
};

const meta = {
  title: 'Features/Users/UserHoverCard',
  component: UserHoverCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex h-64 items-center justify-center bg-dark-900 p-8 rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UserHoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: mockUser,
    children: (
      <span className="text-gold-400 font-bold cursor-pointer hover:underline">
        Hover over me! (@ninja_master)
      </span>
    ),
  },
};

export const WithoutImages: Story = {
  args: {
    user: {
      ...mockUser,
      profileImage: undefined,
      bannerImage: undefined,
    },
    children: (
      <span className="text-gold-400 font-bold cursor-pointer hover:underline">
        Hover over me! (No Images)
      </span>
    ),
  },
};

export const MinimalDetails: Story = {
  args: {
    user: {
      id: 'user-2',
      username: 'newbie',
      email: 'newbie@example.com',
      supabaseId: 'supa-2',
      badges: [],
      displayName: null,
      profileImage: null,
      bannerImage: null,
      description: null,
    },
    children: (
      <span className="text-gold-400 font-bold cursor-pointer hover:underline">
        Hover over me! (Minimal)
      </span>
    ),
  },
};
