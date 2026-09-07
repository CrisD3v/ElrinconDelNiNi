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
  onReply: (comment: Comment) => void;
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
  onReply,
}: CommentReplyListProps) {
  const t = useTranslations('comments');
  const [expanded, setExpanded] = useState(false);
  const hasReplies = comment.replies.length > 0;
  const isReplyingHere = replyingToId === comment.id || comment.replies.some(r => r.id === replyingToId);
  const replyingToComment = isReplyingHere && replyingToId !== comment.id ? comment.replies.find(r => r.id === replyingToId) : null;
  const initialContent = replyingToComment ? `@${replyingToComment.user?.username} ` : '';

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

          <div
            className={`grid transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              expanded ? 'grid-rows-[1fr] opacity-100 mb-3' : 'grid-rows-[0fr] opacity-0 mb-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="space-y-4 border-l-2 border-dark-700/50 pl-4">
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
                    onReply={onReply}
                  />
                ))}
                <button
                  onClick={() => setExpanded(false)}
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  {t('collapseReplies')}
                </button>
              </div>
            </div>
          </div>
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
            placeholder={t('replyPlaceholder', { name: replyingToComment ? replyingToComment.user?.displayName : comment.user?.displayName })}
            initialContent={initialContent}
            compact
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
