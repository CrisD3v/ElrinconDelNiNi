import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    name: {
      control: 'text',
    },
    src: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    alt: 'Foto de usuario',
    size: 'lg',
  },
};

export const WithInitials: Story = {
  args: {
    name: 'Carlos Mendoza',
    size: 'lg',
  },
};

export const SingleInitial: Story = {
  args: {
    name: 'NiNi',
    size: 'md',
  },
};

export const FallbackIcon: Story = {
  args: {
    size: 'lg',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Small" size="sm" />
      <Avatar name="Medium" size="md" />
      <Avatar name="Large" size="lg" />
      <Avatar name="Extra Large" size="xl" />
    </div>
  ),
};
