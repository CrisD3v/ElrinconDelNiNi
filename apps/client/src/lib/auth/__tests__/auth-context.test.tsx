import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../auth-context';

// Mocks
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignInWithOAuth = vi.fn();
const mockSignOut = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signUp: (...args: unknown[]) => mockSignUp(...args),
      signInWithOAuth: (...args: unknown[]) => mockSignInWithOAuth(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
    },
  },
}));

const mockGetMe = vi.fn();
const mockUpdateProfile = vi.fn();
vi.mock('@/lib/api/users', () => ({
  getMe: (...args: unknown[]) => mockGetMe(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}));

// Test consumer component
function TestConsumer() {
  const { user, profile, isLoading, signInWithPassword, signOut, signInWithOAuth } = useAuth();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="user-email">{user?.email || 'no-user'}</div>
      <div data-testid="display-name">{profile?.displayName || 'no-profile'}</div>
      <button
        onClick={() => signInWithPassword('test@example.com', 'password123')}
        data-testid="signin-btn"
      >
        Sign In
      </button>
      <button onClick={() => signInWithOAuth('google')} data-testid="oauth-btn">
        OAuth Google
      </button>
      <button onClick={() => signOut()} data-testid="signout-btn">
        Sign Out
      </button>
    </div>
  );
}

describe('AuthContext / AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    });
  });

  it('renders with initial unauthenticated state when getSession returns null', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    expect(screen.getByTestId('display-name')).toHaveTextContent('no-profile');
  });

  it('loads existing session and retrieves profile from backend API', async () => {
    const mockSession = {
      access_token: 'valid-jwt-token',
      user: {
        id: 'u-1',
        email: 'hero@example.com',
        user_metadata: { full_name: 'Hero User' },
        created_at: '2026-01-01',
      },
    };

    mockGetSession.mockResolvedValue({ data: { session: mockSession } });
    mockGetMe.mockResolvedValue({
      id: 'u-1',
      email: 'hero@example.com',
      displayName: 'Hero NiNi',
      profileImage: 'https://example.com/avatar.jpg',
      badges: ['TRANSLATOR', 'READER'],
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('hero@example.com');
    expect(screen.getByTestId('display-name')).toHaveTextContent('Hero NiNi');
    expect(mockGetMe).toHaveBeenCalledWith('valid-jwt-token');
  });

  it('uses fallback profile when backend getMe fails', async () => {
    const mockSession = {
      access_token: 'valid-token',
      user: {
        id: 'u-2',
        email: 'fallback@example.com',
        user_metadata: { full_name: 'Fallback Name' },
        created_at: '2026-02-01',
      },
    };

    mockGetSession.mockResolvedValue({ data: { session: mockSession } });
    mockGetMe.mockRejectedValue(new Error('Backend offline'));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('fallback@example.com');
    expect(screen.getByTestId('display-name')).toHaveTextContent('Fallback Name');
  });

  it('calls signInWithPassword correctly', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockSignInWithPassword.mockResolvedValue({ error: null });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await act(async () => {
      screen.getByTestId('signin-btn').click();
    });

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('calls signInWithOAuth with configured provider and callback URL', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockSignInWithOAuth.mockResolvedValue({ error: null });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await act(async () => {
      screen.getByTestId('oauth-btn').click();
    });

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
      },
    });
  });

  it('clears user and profile on signOut', async () => {
    const mockSession = {
      access_token: 'token',
      user: { id: 'u-3', email: 'logout@example.com' },
    };
    mockGetSession.mockResolvedValue({ data: { session: mockSession } });
    mockGetMe.mockResolvedValue({
      id: 'u-3',
      email: 'logout@example.com',
      displayName: 'To Logout',
    });
    mockSignOut.mockResolvedValue({ error: null });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('display-name')).toHaveTextContent('To Logout');
    });

    await act(async () => {
      screen.getByTestId('signout-btn').click();
    });

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    expect(screen.getByTestId('display-name')).toHaveTextContent('no-profile');
  });
});
