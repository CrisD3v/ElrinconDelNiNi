import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommentItem } from '../components/comment-item';
import { AuthContext } from '@/lib/auth/auth-context';
import type { Comment } from '@elrincondelnini/types';

// Mock matchMedia
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

const mockComment: Comment = {
  id: 'c1',
  content: 'Test comment content',
  mangaId: 'm1',
  chapterId: null,
  userId: 'u1',
  parentId: null,
  imageUrl: null,
  isSpoiler: false,
  isPinned: false,
  isHidden: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  likesCount: 5,
  dislikesCount: 1,
  myVote: 0,
  reactions: {},
  replies: [],
  user: {
    id: 'u1',
    username: 'testuser',
    displayName: 'Test User',
    profileImage: null,
    badges: [],
  },
};

const mockAuthValue = {
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  signInWithPassword: vi.fn(),
  signUpWithPassword: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  refreshProfile: vi.fn(),
  updateUserProfile: vi.fn(),
} as any;

describe('CommentItem', () => {
  const onVote = vi.fn();
  const onReact = vi.fn();
  const onReport = vi.fn();
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const onReply = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders comment content and username', () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <CommentItem
          comment={mockComment}
          onVote={onVote}
          onReact={onReact}
          onReport={onReport}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
        />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Test comment content')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // likes
    expect(screen.getByText('1')).toBeInTheDocument(); // dislikes
  });

  it('calls onVote when like button is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <CommentItem
          comment={mockComment}
          onVote={onVote}
          onReact={onReact}
          onReport={onReport}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </AuthContext.Provider>
    );

    const likeButton = screen.getByTitle('like');
    fireEvent.click(likeButton);
    expect(onVote).toHaveBeenCalledWith('c1', 1, undefined);
  });

  it('calls onReply when reply button is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <CommentItem
          comment={mockComment}
          onVote={onVote}
          onReact={onReact}
          onReport={onReport}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
        />
      </AuthContext.Provider>
    );

    const replyButton = screen.getByText('reply');
    fireEvent.click(replyButton);
    expect(onReply).toHaveBeenCalledWith(mockComment);
  });
});
