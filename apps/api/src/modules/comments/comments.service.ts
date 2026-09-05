import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '#common/types/index.js';
import { PrismaService } from '../../prisma/prisma.service.js';

const REPORT_AUTO_HIDE_THRESHOLD = 5;
const DEFAULT_PAGE_SIZE = 20;

async function toArray<T>(iterable: any): Promise<T[]> {
  if (Array.isArray(iterable)) return iterable;
  if (!iterable) return [];
  if (typeof iterable.all === 'function') {
    return iterable.all();
  }
  if (typeof iterable.many === 'function') {
    return iterable.many();
  }
  const result: T[] = [];
  if (typeof iterable[Symbol.asyncIterator] === 'function') {
    for await (const item of iterable) result.push(item);
    return result;
  }
  if (typeof iterable[Symbol.iterator] === 'function') {
    for (const item of iterable) result.push(item);
    return result;
  }
  return [iterable as T];
}

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async findUser(supabaseId: string) {
    const user = await this.prisma.db.orm.public.User.where({ supabaseId }).first();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async findComment(id: string) {
    const comment = await this.prisma.db.orm.public.Comment.where({ id }).first();
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  /** Shape a raw comment row with enriched data for the response */
  private async enrichComment(c: any, currentUserId?: string): Promise<any> {
    const user = await this.prisma.db.orm.public.User.where({ id: c.userId }).first();

    // Counts
    const likes: any[] = await toArray(await this.prisma.db.orm.public.CommentLike.where({ commentId: c.id }));
    const likesCount = likes.filter((l) => l.value === 1).length;
    const dislikesCount = likes.filter((l) => l.value === -1).length;
    const myLike = currentUserId ? likes.find((l) => l.userId === currentUserId) : null;

    // Reactions grouped by emoji
    const rawReactions: any[] = await toArray(await this.prisma.db.orm.public.CommentReaction.where({ commentId: c.id }));
    const emojiMap = new Map<string, { count: number; reactedByMe: boolean }>();
    for (const r of rawReactions) {
      const existing = emojiMap.get(r.emoji) ?? { count: 0, reactedByMe: false };
      existing.count += 1;
      if (currentUserId && r.userId === currentUserId) existing.reactedByMe = true;
      emojiMap.set(r.emoji, existing);
    }
    const reactions = Array.from(emojiMap.entries()).map(([emoji, data]) => ({
      emoji,
      ...data,
    }));

    // Report count
    const reports: any[] = await toArray(await this.prisma.db.orm.public.CommentReport.where({ commentId: c.id }));

    return {
      id: c.id,
      content: c.content,
      imageUrl: c.imageUrl,
      isSpoiler: c.isSpoiler,
      isHidden: c.isHidden,
      isPinned: c.isPinned,
      parentId: c.parentId,
      createdAt: c.createdAt?.toString(),
      updatedAt: c.updatedAt?.toString(),
      user: {
        id: user?.id,
        displayName: user?.displayName,
        profileImage: user?.profileImage,
        bannerImage: user?.bannerImage,
        description: user?.description,
        badges: user?.badges,
      },
      likesCount,
      dislikesCount,
      myVote: myLike ? myLike.value : 0,
      reactions,
      reportsCount: reports.length,
      replies: [],
    };
  }

  // ─── List ────────────────────────────────────────────────────────────────────

  private async listComments(
    filter: { mangaId?: string; chapterId?: string },
    cursor?: string,
    currentUserId?: string,
  ) {
    // Fetch top-level comments (no parentId)
    const allComments: any[] = await toArray(await this.prisma.db.orm.public.Comment.where(filter));

    const getMs = (date: any) => {
      if (!date) return 0;
      if (typeof date.epochMilliseconds === 'number') return date.epochMilliseconds;
      return new Date(date.toString()).getTime();
    };

    // Sort by createdAt desc (newest first), filter top-level only
    const topLevel = allComments
      .filter((c) => !c.parentId)
      .sort((a, b) => getMs(b.createdAt) - getMs(a.createdAt));

    // Cursor pagination
    let startIdx = 0;
    if (cursor) {
      const idx = topLevel.findIndex((c) => c.id === cursor);
      startIdx = idx >= 0 ? idx + 1 : 0;
    }
    const page = topLevel.slice(startIdx, startIdx + DEFAULT_PAGE_SIZE);
    const nextCursor = startIdx + DEFAULT_PAGE_SIZE < topLevel.length
      ? page[page.length - 1]?.id ?? null
      : null;

    // Enrich and attach replies
    const enriched = await Promise.all(
      page.map(async (c) => {
        const enrichedComment = await this.enrichComment(c, currentUserId);
        // Replies: children of this comment
        const rawReplies = allComments
          .filter((r) => r.parentId === c.id)
          .sort((a, b) => getMs(a.createdAt) - getMs(b.createdAt));
        enrichedComment.replies = await Promise.all(
          rawReplies.map((r) => this.enrichComment(r, currentUserId)),
        );
        return enrichedComment;
      }),
    );

    return { comments: enriched, nextCursor, total: topLevel.length };
  }

  async getCommentsByManga(mangaId: string, cursor?: string, currentUserId?: string) {
    return this.listComments({ mangaId }, cursor, currentUserId);
  }

  async getCommentsByChapter(chapterId: string, cursor?: string, currentUserId?: string) {
    return this.listComments({ chapterId }, cursor, currentUserId);
  }

  // ─── Create ─────────────────────────────────────────────────────────────────

  async createComment(
    authUser: AuthenticatedUser,
    data: {
      content: string;
      mangaId?: string;
      chapterId?: string;
      parentId?: string;
      isSpoiler?: boolean;
      imageUrl?: string | null;
    },
  ): Promise<any> {
    if (!data.mangaId && !data.chapterId) {
      throw new BadRequestException('Comment must be attached to a mangaId or chapterId');
    }

    const user = await this.findUser(authUser.supabaseId);

    // If reply, verify parent exists and resolve its context
    if (data.parentId) {
      const parent = await this.findComment(data.parentId);
      // Replies inherit the parent's mangaId/chapterId context
      data.mangaId = data.mangaId || parent.mangaId || undefined;
      data.chapterId = data.chapterId || parent.chapterId || undefined;
    }

    const comment = await this.prisma.db.orm.public.Comment.create({
      userId: user.id,
      content: data.content,
      mangaId: data.mangaId || null,
      chapterId: data.chapterId || null,
      parentId: data.parentId || null,
      isSpoiler: data.isSpoiler ?? false,
      imageUrl: data.imageUrl || null,
    });

    return this.enrichComment(comment, user.id);
  }

  // ─── Update ──────────────────────────────────────────────────────────────────

  async updateComment(
    authUser: AuthenticatedUser,
    commentId: string,
    data: { content?: string; isSpoiler?: boolean },
  ): Promise<any> {
    const user = await this.findUser(authUser.supabaseId);
    const comment = await this.findComment(commentId);

    if (comment.userId !== user.id) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    const updateData: any = {};
    if (data.content !== undefined) updateData.content = data.content;
    if (data.isSpoiler !== undefined) updateData.isSpoiler = data.isSpoiler;

    const updated = await this.prisma.db.orm.public.Comment.where({ id: commentId }).update(updateData);
    return this.enrichComment(updated, user.id);
  }

  // ─── Delete ──────────────────────────────────────────────────────────────────

  async deleteComment(authUser: AuthenticatedUser, commentId: string): Promise<{ success: boolean }> {
    const user = await this.findUser(authUser.supabaseId);
    const comment = await this.findComment(commentId);

    if (comment.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.db.orm.public.Comment.where({ id: commentId }).delete();
    return { success: true };
  }

  // ─── Like / Dislike ──────────────────────────────────────────────────────────

  async likeComment(
    authUser: AuthenticatedUser,
    commentId: string,
    value: 1 | -1,
  ): Promise<any> {
    const user = await this.findUser(authUser.supabaseId);
    await this.findComment(commentId);

    const existing = await this.prisma.db.orm.public.CommentLike.where({
      commentId,
      userId: user.id,
    }).first();

    if (existing) {
      if (existing.value === value) {
        // Toggle off (remove the like/dislike)
        await this.prisma.db.orm.public.CommentLike.where({ id: existing.id }).delete();
        return { voted: false, value: 0 };
      }
      // Change vote
      await this.prisma.db.orm.public.CommentLike.where({ id: existing.id }).update({ value });
      return { voted: true, value };
    }

    await this.prisma.db.orm.public.CommentLike.create({ commentId, userId: user.id, value });
    return { voted: true, value };
  }

  // ─── React ───────────────────────────────────────────────────────────────────

  async reactComment(
    authUser: AuthenticatedUser,
    commentId: string,
    emoji: string,
  ): Promise<{ toggled: boolean; emoji: string }> {
    const user = await this.findUser(authUser.supabaseId);
    await this.findComment(commentId);

    const existing = await this.prisma.db.orm.public.CommentReaction.where({
      commentId,
      userId: user.id,
      emoji,
    }).first();

    if (existing) {
      await this.prisma.db.orm.public.CommentReaction.where({ id: existing.id }).delete();
      return { toggled: false, emoji };
    }

    await this.prisma.db.orm.public.CommentReaction.create({ commentId, userId: user.id, emoji });
    return { toggled: true, emoji };
  }

  // ─── Report ──────────────────────────────────────────────────────────────────

  async reportComment(
    authUser: AuthenticatedUser,
    commentId: string,
    reason?: string,
  ): Promise<{ reported: boolean; hidden: boolean }> {
    const user = await this.findUser(authUser.supabaseId);
    const comment = await this.findComment(commentId);

    const existing = await this.prisma.db.orm.public.CommentReport.where({
      commentId,
      userId: user.id,
    }).first();

    if (existing) {
      throw new BadRequestException('You have already reported this comment');
    }

    await this.prisma.db.orm.public.CommentReport.create({
      commentId,
      userId: user.id,
      reason: reason || null,
    });

    // Auto-hide if threshold reached
    const reports: any[] = (await this.prisma.db.orm.public.CommentReport.where({ commentId })) as any;
    let hidden = comment.isHidden;
    if (reports.length >= REPORT_AUTO_HIDE_THRESHOLD && !comment.isHidden) {
      await this.prisma.db.orm.public.Comment.where({ id: commentId }).update({ isHidden: true });
      hidden = true;
    }

    return { reported: true, hidden };
  }

  // ─── Pin ─────────────────────────────────────────────────────────────────────

  async pinComment(commentId: string, pinned: boolean): Promise<any> {
    await this.findComment(commentId);
    const updated = await this.prisma.db.orm.public.Comment.where({ id: commentId }).update({
      isPinned: pinned,
    });
    return this.enrichComment(updated);
  }

  // ─── User search (for @mentions) ─────────────────────────────────────────────

  async searchUsers(query: string): Promise<any[]> {
    if (!query || query.length < 2) return [];

    // Fetch all users and filter by displayName (simple approach)
    const all: any[] = (await this.prisma.db.orm.public.User.where({})) as any;
    const q = query.toLowerCase();
    return all
      .filter((u) => u.displayName?.toLowerCase().includes(q))
      .slice(0, 10)
      .map((u) => ({
        id: u.id,
        displayName: u.displayName,
        profileImage: u.profileImage,
        badges: u.badges,
      }));
  }
}
