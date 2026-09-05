'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';
import { Toaster } from 'sileo';
import { supabase } from '@/lib/supabase/client';
import { getMe, updateProfile as apiUpdateProfile, UserMe } from '@/lib/api/users';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserMe | null;
  isLoading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: Error | null }>;
  signUpWithPassword: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ error?: Error | null; user?: User | null }>;
  signInWithOAuth: (provider: 'google' | 'discord') => Promise<{ error?: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUserProfile: (formData: FormData) => Promise<UserMe>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserMe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (accessToken: string, currentUser?: User) => {
    try {
      const data = await getMe(accessToken);
      setProfile(data);
    } catch (err) {
      console.warn('Could not fetch user profile from API, using Supabase fallback:', err);
      if (currentUser) {
        setProfile({
          id: currentUser.id,
          email: currentUser.email ?? '',
          displayName:
            currentUser.user_metadata?.full_name ||
            currentUser.user_metadata?.name ||
            currentUser.email?.split('@')[0] ||
            'Usuario',
          profileImage: currentUser.user_metadata?.avatar_url || null,
          bannerImage: null,
          description: null,
          badges: ['READER'],
          locale: 'es',
          createdAt: currentUser.created_at,
        });
      }
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.access_token) {
      await fetchProfile(session.access_token, user ?? undefined);
    }
  }, [session, user, fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    // 1. Check current active session
    supabase.auth
      .getSession()
      .then(async ({ data: { session: currentSession } }) => {
        if (!isMounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.access_token && currentSession.user) {
          await fetchProfile(currentSession.access_token, currentSession.user);
        }
      })
      .catch((err) => {
        console.error('Error fetching Supabase session:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    // 2. Listen to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.access_token && newSession.user) {
        await fetchProfile(newSession.access_token, newSession.user);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signInWithPassword = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error };
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  const signUpWithPassword = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
            name: displayName,
          },
        },
      });
      if (error) return { error };
      return { error: null, user: data.user };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'discord') => {
    try {
      const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo,
        },
      });
      if (error) return { error };
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateUserProfile = async (formData: FormData): Promise<UserMe> => {
    if (!session?.access_token) {
      throw new Error('User not authenticated');
    }
    const updated = await apiUpdateProfile(session.access_token, formData);
    setProfile(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signInWithPassword,
        signUpWithPassword,
        signInWithOAuth,
        signOut,
        refreshProfile,
        updateUserProfile,
      }}
    >
      <Toaster
        position="bottom-right"
        options={{
          fill: '#2a2c2c',
        }}
      />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
