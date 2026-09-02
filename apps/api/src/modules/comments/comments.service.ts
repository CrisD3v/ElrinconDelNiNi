import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '#common/types/index.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(
    authUser: AuthenticatedUser,
    data: {
      content: string;
      mangaId?: string;
      chapterId?: string;
      imageUrl?: string | null;
    },
  ): Promise<any> {
    if (!data.mangaId && !data.chapterId) {
      throw new BadRequestException(
        'Comment must be attached to a mangaId or chapterId',
      );
    }

    const user = await this.prisma.db.orm.public.User.where({
      supabaseId: authUser.supabaseId,
    }).first();
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.db.orm.public.Comment.create({
      userId: user.id,
      content: data.content,
      mangaId: data.mangaId || null,
      chapterId: data.chapterId || null,
      imageUrl: data.imageUrl || null,
    });
  }

  async getCommentsByManga(mangaId: string): Promise<any[]> {
    const comments: any[] = (await this.prisma.db.orm.public.Comment.where({
      mangaId,
    })) as any;

    const userIds = [...new Set(comments.map((c) => c.userId))];
    const users = await Promise.all(
      userIds.map((id) =>
        this.prisma.db.orm.public.User.where({ id: id as string }).first(),
      ),
    );
    const userMap = new Map(users.map((u) => [u?.id, u]));

    return comments.map((c) => ({
      ...c,
      user: {
        id: userMap.get(c.userId)?.id,
        displayName: userMap.get(c.userId)?.displayName,
        profileImage: userMap.get(c.userId)?.profileImage,
        badges: userMap.get(c.userId)?.badges,
      },
    }));
  }

  async getCommentsByChapter(chapterId: string): Promise<any[]> {
    const comments: any[] = (await this.prisma.db.orm.public.Comment.where({
      chapterId,
    })) as any;

    const userIds = [...new Set(comments.map((c) => c.userId))];
    const users = await Promise.all(
      userIds.map((id) =>
        this.prisma.db.orm.public.User.where({ id: id as string }).first(),
      ),
    );
    const userMap = new Map(users.map((u) => [u?.id, u]));

    return comments.map((c) => ({
      ...c,
      user: {
        id: userMap.get(c.userId)?.id,
        displayName: userMap.get(c.userId)?.displayName,
        profileImage: userMap.get(c.userId)?.profileImage,
        badges: userMap.get(c.userId)?.badges,
      },
    }));
  }
}
