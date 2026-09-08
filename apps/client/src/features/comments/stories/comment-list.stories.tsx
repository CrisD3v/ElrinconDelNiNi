import type { Meta, StoryObj } from '@storybook/react';
import { CommentList } from '../components/comment-list';
import type { Comment } from '@elrincondelnini/types';

const mockComment: Comment = {
  id: '1',
  content: 'Este es el primer comentario principal.',
  mangaId: 'manga-1',
  chapterId: null,
  userId: 'user-1',
  parentId: null,
  imageUrl: null,
  isSpoiler: false,
  isPinned: true,
  isHidden: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  likesCount: 15,
  dislikesCount: 1,
  myVote: 1,
  reactions: { '🔥': 5 },
  replies: [],
  user: {
    id: 'user-1',
    username: 'admin',
    displayName: 'Admin User',
    profileImage: null,
    badges: ['ADMIN'],
  },
};

const mockReply: Comment = {
  ...mockComment,
  id: '2',
  content: 'Esta es una respuesta al primer comentario.',
  parentId: '1',
  isPinned: false,
  likesCount: 2,
  user: {
    id: 'user-2',
    username: 'reader',
    displayName: 'Reader User',
    profileImage: null,
    badges: ['READER'],
  },
};

const mockCommentWithReplies = {
  ...mockComment,
  replies: [mockReply],
};

const baseMockCommentsData = {
  comments: [mockCommentWithReplies],
  total: 2,
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: false,
  sentinelRef: () => {},
  addComment: async () => {},
  editComment: async () => {},
  removeComment: async () => {},
  voteComment: async () => {},
  reactToComment: async () => {},
  reportCommentAction: async () => ({ reported: true, hidden: false }),
  newUnreadComments: 0,
  resetUnreadComments: () => {},
  refresh: async () => {},
};

const meta = {
  title: 'Features/Comments/CommentList',
  component: CommentList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto bg-dark-950 p-6 rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommentList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    commentsData: baseMockCommentsData as any,
  },
};

export const Loading: Story = {
  args: {
    commentsData: {
      ...baseMockCommentsData,
      loading: true,
      comments: [],
    } as any,
  },
};

export const Empty: Story = {
  args: {
    commentsData: {
      ...baseMockCommentsData,
      comments: [],
      total: 0,
    } as any,
  },
};

export const WithError: Story = {
  args: {
    commentsData: {
      ...baseMockCommentsData,
      error: 'Hubo un error al cargar los comentarios.',
    } as any,
  },
};

export const NewUnreadComments: Story = {
  args: {
    commentsData: {
      ...baseMockCommentsData,
      newUnreadComments: 3,
    } as any,
  },
};
