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
import { useWebSocket } from '@/providers/websocket-provider';

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
  const { socket, isConnected } = useWebSocket();
  const [newUnreadComments, setNewUnreadComments] = useState<number>(0);

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

  // WebSocket integration
  useEffect(() => {
    if (!socket || !isConnected) return;

    if (mangaId) {
      socket.emit('join-manga-room', mangaId);
    } else if (chapterId) {
      socket.emit('join-chapter-room', chapterId);
    }

    const handleReconnect = () => {
      if (mangaId) socket.emit('join-manga-room', mangaId);
      if (chapterId) socket.emit('join-chapter-room', chapterId);
    };
    
    socket.on('connect', handleReconnect);

    const handleNewComment = (comment: Comment) => {
      // Check if user is near top of comments list (for simplicity, we assume they have scroll if newUnreadComments > 0 or if we want to rely on the UI)
      // Actually we'll just prepend it, and let the UI handle the animation.
      // But the user requested a "1 nuevo comentario" button if scrolled down.
      // We'll increment newUnreadComments. The UI can decide to show the button and not render the comment if newUnreadComments > 0.
      // Wait! If we prepend it, the list will jump. Let's just prepend it. The floating button logic can be handled in the component by checking scroll position.
      setComments((prev) => {
        // Prevent duplicates
        if (prev.some((c) => c.id === comment.id)) return prev;

        if (comment.parentId) {
          return prev.map((c) =>
            c.id === comment.parentId
              ? { ...c, replies: [...c.replies, comment] }
              : c,
          );
        }
        
        // If it's a new top-level comment, check if we should show a button or just prepend
        // We'll increment the counter to let the UI know
        setNewUnreadComments((count) => count + 1);
        
        return [comment, ...prev];
      });
      setTotal((t) => t + 1);
    };

    const handleUpdateComment = (comment: Comment) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id
            ? { ...c, ...comment }
            : {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === comment.id ? { ...r, ...comment } : r,
                ),
              },
        ),
      );
    };

    const handleDeleteComment = (commentId: string) => {
      setComments((prev) => {
        // Try to find if it's a reply
        let isReply = false;
        let parentId = '';
        for (const c of prev) {
          if (c.replies.some((r) => r.id === commentId)) {
            isReply = true;
            parentId = c.id;
            break;
          }
        }
        
        if (isReply) {
          return prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: c.replies.filter((r) => r.id !== commentId) }
              : c,
          );
        }
        
        return prev.filter((c) => c.id !== commentId);
      });
      setTotal((t) => Math.max(0, t - 1));
    };

    socket.on('new-comment', handleNewComment);
    socket.on('update-comment', handleUpdateComment);
    socket.on('delete-comment', handleDeleteComment);

    return () => {
      if (mangaId) socket.emit('leave-manga-room', mangaId);
      if (chapterId) socket.emit('leave-chapter-room', chapterId);
      
      socket.off('new-comment', handleNewComment);
      socket.off('update-comment', handleUpdateComment);
      socket.off('delete-comment', handleDeleteComment);
      socket.off('connect', handleReconnect);
    };
  }, [socket, isConnected, mangaId, chapterId]);

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
        // Prevent duplicate if WebSocket event already added it
        if (prev.some((c) => c.id === newComment.id)) return prev;

        if (payload.parentId) {
          // Append reply to the parent comment
          return prev.map((c) => {
            if (c.id === payload.parentId) {
              if (c.replies.some((r) => r.id === newComment.id)) return c;
              return { ...c, replies: [...c.replies, newComment] };
            }
            return c;
          });
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
    newUnreadComments,
    resetUnreadComments: () => setNewUnreadComments(0),
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
