import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '#common/types/index.js';
import type { FieldOutputTypes } from '../../../prisma/schema';
import { PrismaService } from '../../prisma/prisma.service.js';

type User = FieldOutputTypes['public']['User'];

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(authUser: AuthenticatedUser): Promise<User> {
    const existing = await this.prisma.db.orm.public.User.where({
      supabaseId: authUser.supabaseId,
    }).first();

    if (existing) {
      return existing;
    }

    return this.prisma.db.orm.public.User.create({
      supabaseId: authUser.supabaseId,
      email: authUser.email,
      displayName: authUser.displayName,
      badges: ['READER'],
    });
  }

  async getBySupabaseId(supabaseId: string): Promise<User | null> {
    return this.prisma.db.orm.public.User.where({ supabaseId }).first();
  }

  async updateProfile(
    id: string,
    data: {
      description?: string;
      displayName?: string;
      profileImage?: string | null;
      bannerImage?: string | null;
    },
  ): Promise<any> {
    const updateData: any = {};
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.displayName !== undefined)
      updateData.displayName = data.displayName;
    if (data.profileImage !== undefined)
      updateData.profileImage = data.profileImage;
    if (data.bannerImage !== undefined)
      updateData.bannerImage = data.bannerImage;

    return this.prisma.db.orm.public.User.where({ id }).update(updateData);
  }

  async follow(followerId: string, followingId: string): Promise<any> {
    if (followerId === followingId)
      throw new BadRequestException('You cannot follow yourself');

    const followingUser = await this.prisma.db.orm.public.User.where({
      id: followingId,
    }).first();
    if (!followingUser) throw new NotFoundException('User not found');

    const existing = await this.prisma.db.orm.public.Follow.where({
      followerId,
      followingId,
    }).first();
    if (existing) return existing;

    return this.prisma.db.orm.public.Follow.create({
      followerId,
      followingId,
    });
  }

  async unfollow(followerId: string, followingId: string) {
    const existing = await this.prisma.db.orm.public.Follow.where({
      followerId,
      followingId,
    }).first();
    if (existing) {
      await this.prisma.db.orm.public.Follow.where({
        id: existing.id,
      }).delete();
    }
    return { success: true };
  }

  async getFollowers(userId: string): Promise<any[]> {
    const follows: any[] = (await this.prisma.db.orm.public.Follow.where({
      followingId: userId,
    })) as any;
    // Prisma Next does not seem to include relations in .many() by default the same way
    // Assuming simple mapping or fetching users manually
    const followerIds = follows.map((f) => f.followerId);
    if (!followerIds.length) return [];

    // In a real app we'd use an 'in' query if available, or just join.
    // For now we'll fetch them individually since we aren't sure of Prisma Next's 'in' syntax yet.
    const users = await Promise.all(
      followerIds.map((id) =>
        this.prisma.db.orm.public.User.where({ id: id as string }).first(),
      ),
    );
    return users
      .filter((u) => u !== null)
      .map((u) => ({
        id: u?.id,
        displayName: u?.displayName,
        profileImage: u?.profileImage,
        description: u?.description,
        badges: u?.badges,
      }));
  }

  async getFollowing(userId: string): Promise<any[]> {
    const follows: any[] = (await this.prisma.db.orm.public.Follow.where({
      followerId: userId,
    })) as any;
    const followingIds = follows.map((f) => f.followingId);
    if (!followingIds.length) return [];

    const users = await Promise.all(
      followingIds.map((id) =>
        this.prisma.db.orm.public.User.where({ id: id as string }).first(),
      ),
    );
    return users
      .filter((u) => u !== null)
      .map((u) => ({
        id: u?.id,
        displayName: u?.displayName,
        profileImage: u?.profileImage,
        description: u?.description,
        badges: u?.badges,
      }));
  }
}
