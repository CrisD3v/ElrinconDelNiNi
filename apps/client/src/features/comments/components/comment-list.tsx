'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { Comment } from '@elrincondelnini/types';
import { useComments } from '../hooks/use-comments';
import { CommentItem } from './comment-item';
import { CommentReplyList } from './comment-reply-list';

interface CommentListProps {
  commentsData: ReturnType<typeof useComments>;
}

export function CommentList({ commentsData }: CommentListProps) {
  const t = useTranslations('comments');
  const {
    comments,
    total,
    loading,
    loadingMore,
    error,
    hasMore,
    sentinelRef,
    addComment,
    editComment,
    removeComment,
    voteComment,
    reactToComment,
    reportCommentAction,
    newUnreadComments,
    resetUnreadComments,
    refresh,
  } = commentsData;

  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  // Auto-scroll to comment hash when data finishes loading
  useEffect(() => {
    if (!loading && comments.length > 0 && typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#comment-')) {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          // Add a slight delay to ensure rendering is complete
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Optional: highlight the comment briefly
            el.classList.add('ring-2', 'ring-gold-500', 'ring-offset-2', 'ring-offset-dark-900', 'transition-all', 'duration-1000');
            setTimeout(() => {
              el.classList.remove('ring-2', 'ring-gold-500', 'ring-offset-2', 'ring-offset-dark-900');
            }, 3000);
          }, 100);
        }
      }
    }
  }, [loading, comments.length]);

  const handleReply = (comment: Comment) => {
    setReplyingToId((prev) => (prev === comment.id ? null : comment.id));
  };

  if (loading) {
    return (
      <div className="space-y-5 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-dark-700 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-dark-700" />
              <div className="h-3 w-full rounded bg-dark-700" />
              <div className="h-3 w-3/4 rounded bg-dark-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-sm text-red-300 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {error}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center gap-3 py-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-dark-800/60 border border-dark-600/40 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-text-muted" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-text-secondary">{t('noComments')}</p>
        <p className="text-xs text-text-muted">{t('beFirstComment')}</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-xs text-text-muted mb-4 font-medium tracking-wide">
        {t('commentsCount', { count: total })}
      </p>

      <div className="space-y-5">
        {comments.map((comment) => (
          <div key={comment.id} id={`comment-${comment.id}`} className="space-y-2">
            {/* Pinned comments appear at the top with a gold accent */}
            <div
              className={
                comment.isPinned
                  ? 'rounded-xl border border-gold-500/20 bg-gold-500/5 p-3 -mx-3'
                  : ''
              }
            >
              <CommentItem
                comment={comment}
                onVote={voteComment}
                onReact={reactToComment}
                onReport={reportCommentAction}
                onEdit={editComment}
                onDelete={removeComment}
                onReply={handleReply}
              />
            </div>

            <CommentReplyList
              comment={comment}
              replyingToId={replyingToId}
              onVote={voteComment}
              onReact={reactToComment}
              onReport={reportCommentAction}
              onEdit={editComment}
              onDelete={removeComment}
              onAddReply={async (payload) => {
                await addComment(payload);
                setReplyingToId(null);
              }}
              onCancelReply={() => setReplyingToId(null)}
              onReply={handleReply}
            />
          </div>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {loadingMore && (
        <div className="flex justify-center py-4">
          <svg className="animate-spin text-gold-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
        </div>
      )}

      {!hasMore && comments.length > 0 && (
        <p className="text-center text-xs text-text-muted py-4">
          — {t('allCommentsLoaded')} —
        </p>
      )}

      {/* Floating button for new unread comments */}
      {newUnreadComments > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              resetUnreadComments();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/90 backdrop-blur-sm shadow-xl text-white font-semibold text-sm hover:bg-accent transition-all animate-bounce"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
            {newUnreadComments} {newUnreadComments === 1 ? 'nuevo comentario' : 'nuevos comentarios'}
          </button>
        </div>
      )}
    </div>
  );
}
