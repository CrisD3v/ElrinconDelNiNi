import type { Meta, StoryObj } from '@storybook/react';
import { CommentItem } from '../components/comment-item';
import type { Comment } from '@elrincondelnini/types';

const meta = {
  title: 'Features/Comments/CommentItem',
  component: CommentItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onVote: { action: 'voted' },
    onReact: { action: 'reacted' },
    onReport: { action: 'reported' },
    onEdit: { action: 'edited' },
    onDelete: { action: 'deleted' },
    onReply: { action: 'replied' },
  },
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockComment: Comment = {
  id: '1',
  content: 'Este es un comentario de prueba para ver cómo se renderiza.',
  mangaId: 'manga-1',
  chapterId: null,
  userId: 'user-1',
  parentId: null,
  imageUrl: null,
  isSpoiler: false,
  isPinned: false,
  isHidden: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  likesCount: 10,
  dislikesCount: 2,
  myVote: 0,
  reactions: { '🔥': 5, '❤️': 2 },
  replies: [],
  user: {
    id: 'user-1',
    username: 'testuser',
    displayName: 'Test User',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    badges: ['READER'],
  },
};

export const Default: Story = {
  args: {
    comment: mockComment,
  },
};

export const Pinned: Story = {
  args: {
    comment: { ...mockComment, isPinned: true },
  },
};

export const Spoiler: Story = {
  args: {
    comment: { ...mockComment, isSpoiler: true },
  },
};

export const OwnComment: Story = {
  args: {
    comment: mockComment,
  },
  parameters: {
    auth: {
      profile: { id: 'user-1', username: 'testuser' }, // Matches comment author to show edit/delete
    },
  },
};

export const Hidden: Story = {
  args: {
    comment: { ...mockComment, isHidden: true },
  },
};

export const WithImage: Story = {
  args: {
    comment: {
      ...mockComment,
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop',
    },
  },
};
