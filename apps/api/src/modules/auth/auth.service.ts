import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthenticatedUser } from '#common/types/index.js';

@Injectable()
export class AuthService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly config: ConfigService) {
    const url = this.config.getOrThrow<string>('SUPABASE_URL');
    const serviceRoleKey = this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.supabase = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  async verifyToken(token: string): Promise<AuthenticatedUser> {
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user?.email) {
      throw new UnauthorizedException('Token is invalid or expired');
    }

    const metadata = data.user.user_metadata as Record<string, unknown> | undefined;
    const displayName =
      (typeof metadata?.full_name === 'string' && metadata.full_name) ||
      (typeof metadata?.name === 'string' && metadata.name) ||
      undefined;

    return {
      supabaseId: data.user.id,
      email: data.user.email,
      displayName,
    };
  }
}
