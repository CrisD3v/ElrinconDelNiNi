import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://vyowfhvbqffklhibqqmv.supabase.co';

const supabaseAnonKey =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5b3dmaHZicWZma2xoaWJxcW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDgyNjIsImV4cCI6MjEwMzcyNDI2Mn0.VOIQBD-3uJJWIK-FO5RiYBsZHdIFIAQFgdHE5tpG2xM';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
