export interface AuthenticatedUser {
  supabaseId: string;
  email: string;
  displayName?: string;
}
