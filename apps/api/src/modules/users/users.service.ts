import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '#common/types/index.js';
import type { FieldOutputTypes } from '../../../prisma/schema';
import { PrismaService } from '../../prisma/prisma.service.js';

type User = FieldOutputTypes['public']['User'];

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async findOrCreate(authUser: AuthenticatedUser): Promise<User> {
    const existing = await this.prisma.db.orm.public.User
      .where({ supabaseId: authUser.supabaseId })
      .first();

    if (existing) {
      if (authUser.displayName && existing.displayName !== authUser.displayName) {
        const updated = await this.prisma.db.orm.public.User
          .where({ id: existing.id })
          .update({ displayName: authUser.displayName });
        if (updated) return updated;
      }
      return existing;
    }

    return this.prisma.db.orm.public.User.create({
      supabaseId: authUser.supabaseId,
      email: authUser.email,
      displayName: authUser.displayName,
    });
  }

  async getBySupabaseId(supabaseId: string): Promise<User | null> {
    return this.prisma.db.orm.public.User.where({ supabaseId }).first();
  }
}
