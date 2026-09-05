'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth/auth-context';
import type { Comment } from '@elrincondelnini/types';
import { CommentSpoilerWrapper } from './comment-spoiler-wrapper';
import { CommentReactionPicker } from './comment-reaction-picker';
import { CommentReportDialog } from './comment-report-dialog';
import { CommentForm } from './comment-form';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d`;
  return new Date(dateStr).toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onVote: (commentId: string, value: 1 | -1, parentId?: string) => Promise<void>;
  onReact: (commentId: string, emoji: string, parentId?: string) => Promise<void>;
  onReport: (commentId: string, reason?: string) => Promise<{ reported: boolean; hidden: boolean }>;
  onEdit: (commentId: string, data: { content?: string; isSpoiler?: boolean }) => Promise<void>;
  onDelete: (commentId: string, parentId?: string) => Promise<void>;
  onReply?: (comment: Comment) => void;
  parentId?: string;
}

export function CommentItem({
  comment,
  isReply = false,
  onVote,
  onReact,
  onReport,
  onEdit,
  onDelete,
  onReply,
  parentId,
}: CommentItemProps) {
  const t = useTranslations('comments');
  const { profile } = useAuth();

  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const isOwn = profile?.id === comment.user?.id;
  const isHidden = comment.isHidden && !revealed;

  if (isHidden) {
    return (
      <div className="flex gap-3 py-2">
        <div className="w-7 h-7 rounded-full bg-dark-700 flex-shrink-0" />
        <div className="flex-1">
          <button
            onClick={() => setRevealed(true)}
            className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {t('hiddenComment')} — {t('clickReveal')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex gap-3 ${isReply ? 'pl-4' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {comment.user?.profileImage ? (
          <img
            src={comment.user.profileImage}
            alt={comment.user.displayName}
            className="w-8 h-8 rounded-full object-cover border border-dark-600/50"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-dark-700 to-dark-600 flex items-center justify-center border border-dark-600/50">
            <span className="text-xs font-bold text-text-secondary">
              {comment.user?.displayName?.[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold text-text-primary">
            {comment.user?.displayName ?? 'Usuario'}
          </span>
          {comment.isPinned && (
            <span className="flex items-center gap-0.5 text-xs text-gold-400 font-medium">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {t('pinned')}
            </span>
          )}
          <span className="text-xs text-text-muted">{timeAgo(comment.createdAt)}</span>
          {comment.updatedAt !== comment.createdAt && (
            <span className="text-xs text-text-muted italic">({t('edited')})</span>
          )}
        </div>

        {/* Comment body */}
        {isEditing ? (
          <CommentForm
            onSubmit={async (payload) => {
              await onEdit(comment.id, { content: payload.content, isSpoiler: payload.isSpoiler });
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
            autoFocus
            compact
          />
        ) : (
          <CommentSpoilerWrapper isSpoiler={comment.isSpoiler}>
            <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap break-words">
              {/* Render @mentions with highlight */}
              {comment.content.split(/(@\w+)/g).map((part, i) =>
                part.startsWith('@') ? (
                  <span key={i} className="text-gold-400 font-medium">{part}</span>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )}
            </div>
            {comment.imageUrl && (
              <img
                src={comment.imageUrl}
                alt="Imagen adjunta"
                className="mt-2 max-h-64 rounded-xl object-cover border border-dark-600/30 cursor-zoom-in"
                onClick={() => window.open(comment.imageUrl!, '_blank')}
              />
            )}
          </CommentSpoilerWrapper>
        )}

        {/* Actions bar */}
        {!isEditing && (
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Like / Dislike */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onVote(comment.id, 1, parentId)}
                className={`flex items-center gap-1 text-xs transition-all rounded-lg px-2 py-1 hover:bg-dark-700/50 ${
                  comment.myVote === 1 ? 'text-gold-400' : 'text-text-muted hover:text-text-secondary'
                }`}
                title={t('like')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={comment.myVote === 1 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
                <span className="font-medium">{comment.likesCount}</span>
              </button>
              <button
                onClick={() => onVote(comment.id, -1, parentId)}
                className={`flex items-center gap-1 text-xs transition-all rounded-lg px-2 py-1 hover:bg-dark-700/50 ${
                  comment.myVote === -1 ? 'text-red-400' : 'text-text-muted hover:text-text-secondary'
                }`}
                title={t('dislike')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={comment.myVote === -1 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
                  <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                </svg>
                <span className="font-medium">{comment.dislikesCount}</span>
              </button>
            </div>

            {/* Reply button (only on top-level) */}
            {!isReply && onReply && (
              <button
                onClick={() => onReply(comment)}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-gold-400 transition-colors rounded-lg px-2 py-1 hover:bg-dark-700/50"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
                </svg>
                {t('reply')}
              </button>
            )}

            {/* Reactions */}
            <CommentReactionPicker
              reactions={comment.reactions}
              onReact={(emoji) => onReact(comment.id, emoji, parentId)}
            />

            {/* Context menu */}
            <div className="relative ml-auto">
              <button
                onClick={() => setShowMenu((o) => !o)}
                className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-7 h-7 rounded-lg text-text-muted hover:text-text-primary hover:bg-dark-700/50 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-xl border border-dark-600/60 bg-dark-900/95 backdrop-blur-sm shadow-xl overflow-hidden"
                  onMouseLeave={() => setShowMenu(false)}
                >
                  {isOwn && (
                    <>
                      <button
                        onClick={() => { setIsEditing(true); setShowMenu(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-dark-700/60 hover:text-text-primary transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => { onDelete(comment.id, parentId); setShowMenu(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                        {t('delete')}
                      </button>
                    </>
                  )}
                  {!isOwn && (
                    <button
                      onClick={() => { setShowReportDialog(true); setShowMenu(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-dark-700/60 hover:text-text-primary transition-colors"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                        <line x1="4" y1="22" x2="4" y2="15"/>
                      </svg>
                      {t('report')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Report dialog */}
      {showReportDialog && (
        <CommentReportDialog
          commentId={comment.id}
          onReport={onReport}
          onClose={() => setShowReportDialog(false)}
        />
      )}
    </div>
  );
}
