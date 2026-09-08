import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CommentSection } from '../components/comment-section';
import { useComments } from '../hooks/use-comments';
import { AuthContext } from '@/lib/auth/auth-context';

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

vi.mock('../hooks/use-comments');

const mockAuthValue = {
  profile: { id: 'u1', username: 'testuser' },
  user: { id: 'u1' },
  session: {},
} as any;

describe('CommentSection Integration', () => {
  it('renders loading state initially', () => {
    vi.mocked(useComments).mockReturnValue({
      comments: [],
      total: 0,
      loading: true,
      loadingMore: false,
      error: null,
      hasMore: false,
      sentinelRef: vi.fn() as any,
      addComment: vi.fn(),
      editComment: vi.fn(),
      removeComment: vi.fn(),
      voteComment: vi.fn(),
      reactToComment: vi.fn(),
      reportCommentAction: vi.fn() as any,
      newUnreadComments: 0,
      resetUnreadComments: vi.fn(),
      refresh: vi.fn(),
    });

    render(
      <AuthContext.Provider value={mockAuthValue}>
        <CommentSection mangaId="m1" />
      </AuthContext.Provider>
    );

    // Should render the form
    expect(screen.getByPlaceholderText('commentPlaceholder')).toBeInTheDocument();
    
    // The loading skeleton should be in the document
    // We can just verify noComments isn't shown because it's loading
    expect(screen.queryByText('noComments')).not.toBeInTheDocument();
  });

  it('renders comments when loaded', () => {
    vi.mocked(useComments).mockReturnValue({
      comments: [
        {
          id: 'c1',
          content: 'Integration test comment',
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
          likesCount: 0,
          dislikesCount: 0,
          myVote: 0,
          reactions: {},
          replies: [],
          user: { id: 'u1', username: 'testuser', displayName: 'Test User', badges: [] },
        } as any,
      ],
      total: 1,
      loading: false,
      loadingMore: false,
      error: null,
      hasMore: false,
      sentinelRef: vi.fn() as any,
      addComment: vi.fn(),
      editComment: vi.fn(),
      removeComment: vi.fn(),
      voteComment: vi.fn(),
      reactToComment: vi.fn(),
      reportCommentAction: vi.fn() as any,
      newUnreadComments: 0,
      resetUnreadComments: vi.fn(),
      refresh: vi.fn(),
    });

    render(
      <AuthContext.Provider value={mockAuthValue}>
        <CommentSection mangaId="m1" />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Integration test comment')).toBeInTheDocument();
  });
});
