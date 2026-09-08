import type { Meta, StoryObj } from '@storybook/react';
import { CommentForm } from '../components/comment-form';

const meta = {
  title: 'Features/Comments/CommentForm',
  component: CommentForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' },
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] bg-dark-900 p-4 rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommentForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: async () => {},
  },
  parameters: {
    auth: {
      profile: { id: 'user-1', username: 'testuser', profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
    },
  },
};

export const Unauthenticated: Story = {
  args: {
    onSubmit: async () => {},
  },
  parameters: {
    auth: {
      profile: null,
      user: null,
    },
  },
};

export const CompactReply: Story = {
  args: {
    compact: true,
    placeholder: 'Responder a @testuser...',
    initialContent: '@testuser ',
    onSubmit: async () => {},
    onCancel: () => {},
  },
  parameters: {
    auth: {
      profile: { id: 'user-1', username: 'testuser' },
    },
  },
};
