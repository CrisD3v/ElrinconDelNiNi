'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getCommentsByManga,
  getCommentsByChapter,
  createComment as apiCreateComment,
  updateComment as apiUpdateComment,
  deleteComment as apiDeleteComment,
  likeComment as apiLikeComment,
  reactComment as apiReactComment,
  reportComment as apiReportComment,
} from '@/lib/api/comments';
import type { Comment, CommentsPage } from '@elrincondelnini/types';
import { useAuth } from '@/lib/auth/auth-context';

interface UseCommentsOptions {
  mangaId?: string;
  chapterId?: string;
}

export function useComments({ mangaId, chapterId }: UseCommentsOptions) {
  const { session } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  const fetchPage = useCallback(
    async (cursor?: string) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      cursor ? setLoadingMore(true) : setLoading(true);

      try {
        let page: CommentsPage;
        if (mangaId) {
          page = await getCommentsByManga(mangaId, cursor);
        } else if (chapterId) {
          page = await getCommentsByChapter(chapterId, cursor);
        } else {
          return;
        }

        setComments((prev) => (cursor ? [...prev, ...page.comments] : page.comments));
        setNextCursor(page.nextCursor);
        setTotal(page.total);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error cargando comentarios');
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    [mangaId, chapterId],
  );

  // Initial load
  useEffect(() => {
    setComments([]);
    setNextCursor(null);
    fetchPage();
  }, [fetchPage]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !isLoadingRef.current) {
          fetchPage(nextCursor);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [nextCursor, fetchPage]);

  // ─── Mutations ────────────────────────────────────────────────────────────

  const addComment = useCallback(
    async (payload: {
      content: string;
      parentId?: string;
      isSpoiler?: boolean;
      image?: File | null;
    }) => {
      if (!session?.access_token) throw new Error('Not authenticated');

      const newComment = await apiCreateComment(session.access_token, {
        ...payload,
        mangaId,
        chapterId,
      });

      setComments((prev) => {
        if (payload.parentId) {
          // Append reply to the parent comment
          return prev.map((c) =>
            c.id === payload.parentId
              ? { ...c, replies: [...c.replies, newComment] }
              : c,
          );
        }
        // New top-level comment: prepend to list
        return [newComment, ...prev];
      });
      setTotal((t) => t + 1);
      return newComment;
    },
    [session, mangaId, chapterId],
  );

  const editComment = useCallback(
    async (commentId: string, data: { content?: string; isSpoiler?: boolean }) => {
      if (!session?.access_token) throw new Error('Not authenticated');
      const updated = await apiUpdateComment(session.access_token, commentId, data);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, ...updated }
            : {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === commentId ? { ...r, ...updated } : r,
                ),
              },
        ),
      );
    },
    [session],
  );

  const removeComment = useCallback(
    async (commentId: string, parentId?: string) => {
      if (!session?.access_token) throw new Error('Not authenticated');
      await apiDeleteComment(session.access_token, commentId);
      setComments((prev) => {
        if (parentId) {
          return prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: c.replies.filter((r) => r.id !== commentId) }
              : c,
          );
        }
        return prev.filter((c) => c.id !== commentId);
      });
      setTotal((t) => Math.max(0, t - 1));
    },
    [session],
  );

  const voteComment = useCallback(
    async (commentId: string, value: 1 | -1, parentId?: string) => {
      if (!session?.access_token) throw new Error('Not authenticated');
      const result = await apiLikeComment(session.access_token, commentId, value);

      const applyVote = (c: Comment): Comment => {
        if (c.id !== commentId) return c;
        const prevVote = c.myVote;
        const newVote = result.voted ? result.value : 0;
        return {
          ...c,
          myVote: newVote as 1 | -1 | 0,
          likesCount:
            c.likesCount +
            (newVote === 1 ? 1 : 0) -
            (prevVote === 1 ? 1 : 0),
          dislikesCount:
            c.dislikesCount +
            (newVote === -1 ? 1 : 0) -
            (prevVote === -1 ? 1 : 0),
        };
      };

      setComments((prev) =>
        prev.map((c) =>
          parentId
            ? { ...c, replies: c.replies.map(applyVote) }
            : applyVote(c),
        ),
      );
    },
    [session],
  );

  const reactToComment = useCallback(
    async (commentId: string, emoji: string, parentId?: string) => {
      if (!session?.access_token) throw new Error('Not authenticated');
      const result = await apiReactComment(session.access_token, commentId, emoji);

      const applyReaction = (c: Comment): Comment => {
        if (c.id !== commentId) return c;
        const existing = c.reactions.find((r) => r.emoji === emoji);
        if (result.toggled) {
          if (existing) {
            return {
              ...c,
              reactions: c.reactions.map((r) =>
                r.emoji === emoji
                  ? { ...r, count: r.count + 1, reactedByMe: true }
                  : r,
              ),
            };
          }
          return {
            ...c,
            reactions: [...c.reactions, { emoji, count: 1, reactedByMe: true }],
          };
        }
        // Removed reaction
        return {
          ...c,
          reactions: c.reactions
            .map((r) =>
              r.emoji === emoji ? { ...r, count: r.count - 1, reactedByMe: false } : r,
            )
            .filter((r) => r.count > 0),
        };
      };

      setComments((prev) =>
        prev.map((c) =>
          parentId
            ? { ...c, replies: c.replies.map(applyReaction) }
            : applyReaction(c),
        ),
      );
    },
    [session],
  );

  const reportCommentAction = useCallback(
    async (commentId: string, reason?: string) => {
      if (!session?.access_token) throw new Error('Not authenticated');
      return apiReportComment(session.access_token, commentId, reason);
    },
    [session],
  );

  return {
    comments,
    total,
    loading,
    loadingMore,
    error,
    hasMore: !!nextCursor,
    sentinelRef,
    addComment,
    editComment,
    removeComment,
    voteComment,
    reactToComment,
    reportCommentAction,
    refresh: () => {
      setComments([]);
      setNextCursor(null);
      fetchPage();
    },
  };
}
