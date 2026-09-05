import type { User, Session } from '@supabase/supabase-js';
import type { UserMe } from '@elrincondelnini/types';

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
