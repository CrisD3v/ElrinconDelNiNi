'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Comment } from '@elrincondelnini/types';
import { CommentItem } from './comment-item';
import { CommentForm } from './comment-form';

interface CommentReplyListProps {
  comment: Comment;
  replyingToId: string | null;
  onVote: (commentId: string, value: 1 | -1, parentId?: string) => Promise<void>;
  onReact: (commentId: string, emoji: string, parentId?: string) => Promise<void>;
  onReport: (commentId: string, reason?: string) => Promise<{ reported: boolean; hidden: boolean }>;
  onEdit: (commentId: string, data: { content?: string; isSpoiler?: boolean }) => Promise<void>;
  onDelete: (commentId: string, parentId?: string) => Promise<void>;
  onAddReply: (payload: { content: string; isSpoiler: boolean; image: File | null; parentId: string }) => Promise<void>;
  onCancelReply: () => void;
}

export function CommentReplyList({
  comment,
  replyingToId,
  onVote,
  onReact,
  onReport,
  onEdit,
  onDelete,
  onAddReply,
  onCancelReply,
}: CommentReplyListProps) {
  const t = useTranslations('comments');
  const [expanded, setExpanded] = useState(false);
  const hasReplies = comment.replies.length > 0;
  const isReplyingHere = replyingToId === comment.id;

  return (
    <div className="ml-11">
      {/* Replies */}
      {hasReplies && (
        <>
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-medium transition-colors mb-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              {comment.replies.length === 1
                ? t('viewOneReply')
                : t('viewReplies', { count: comment.replies.length })}
            </button>
          )}

          {expanded && (
            <div className="space-y-4 border-l-2 border-dark-700/50 pl-4 mb-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply
                  parentId={comment.id}
                  onVote={onVote}
                  onReact={onReact}
                  onReport={onReport}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
              <button
                onClick={() => setExpanded(false)}
                className="text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                {t('collapseReplies')}
              </button>
            </div>
          )}
        </>
      )}

      {/* Reply form */}
      {isReplyingHere && (
        <div className="mb-3">
          <CommentForm
            onSubmit={(payload) =>
              onAddReply({ ...payload, parentId: comment.id })
            }
            onCancel={onCancelReply}
            placeholder={t('replyPlaceholder', { name: comment.user?.displayName })}
            compact
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
