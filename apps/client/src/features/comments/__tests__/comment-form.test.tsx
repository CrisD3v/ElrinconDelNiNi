import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommentForm } from '../components/comment-form';
import { AuthContext } from '@/lib/auth/auth-context';

const mockAuthValue = {
  profile: { id: 'u1', username: 'testuser' },
  user: { id: 'u1' },
} as any;

describe('CommentForm', () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <CommentForm onSubmit={onSubmit} onCancel={onCancel} />
      </AuthContext.Provider>
    );
    expect(screen.getByPlaceholderText('commentPlaceholder')).toBeInTheDocument();
  });

  it('submits form with content', async () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <CommentForm onSubmit={onSubmit} onCancel={onCancel} />
      </AuthContext.Provider>
    );

    const input = screen.getByPlaceholderText('commentPlaceholder');
    fireEvent.change(input, { target: { value: 'This is a test comment' } });
    
    const submitBtn = screen.getByText('publish');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        content: 'This is a test comment',
        isSpoiler: false,
        image: null,
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <CommentForm onSubmit={onSubmit} onCancel={onCancel} compact />
      </AuthContext.Provider>
    );

    const cancelBtn = screen.getByText('cancel');
    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalled();
  });
});
