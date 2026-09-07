'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth/auth-context';
import { useComments } from '../hooks/use-comments';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';

interface CommentSectionProps {
  mangaId?: string;
  chapterId?: string;
  /** When true renders in a compact panel (reader mode) */
  compact?: boolean;
}

export function CommentSection({ mangaId, chapterId, compact = false }: CommentSectionProps) {
  const t = useTranslations('comments');
  const { profile, session } = useAuth();
  const commentsData = useComments({ mangaId, chapterId });
  const { addComment, total } = commentsData;

  return (
    <div className={compact ? 'flex flex-col h-full' : ''}>
      {/* Header */}
      {!compact && (
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gold-400" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <h2 className="text-lg font-bold text-text-primary">{t('comments')}</h2>
          </div>
          <span className="text-sm text-text-muted">({total})</span>
        </div>
      )}

      {/* Composer */}
      {session ? (
        <div className={`flex gap-3 ${compact ? 'px-4 pt-4 pb-3 border-b border-dark-700/50' : 'mb-6'}`}>
          {/* User avatar */}
          <div className="flex-shrink-0 mt-0.5">
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.displayName}
                className="w-8 h-8 rounded-full object-cover border border-dark-600/50"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500/30 to-dark-700 flex items-center justify-center border border-gold-500/20">
                <span className="text-xs font-bold text-gold-400">
                  {profile?.displayName?.[0]?.toUpperCase() ?? '?'}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {!profile?.username ? (
              <div className="h-[80px] rounded-2xl border border-dark-600/60 bg-dark-800/60 flex flex-col items-center justify-center text-center p-4">
                <p className="text-sm text-text-secondary mb-1">Casi listo, solo falta un detalle.</p>
                <p className="text-xs text-text-muted">
                  Ve a <span className="text-gold-400 font-semibold cursor-pointer" onClick={() => document.getElementById('profile-menu-trigger')?.click()}>Perfil &gt; Ajustes</span> y configura un @usuario único para poder comentar.
                </p>
              </div>
            ) : (
              <CommentForm
                onSubmit={async (payload) => {
                  await addComment(payload);
                }}
                compact={compact}
              />
            )}
          </div>
        </div>
      ) : (
        <div className={`flex items-center gap-3 p-4 rounded-xl border border-dark-600/40 bg-dark-800/30 ${compact ? 'mx-4 mt-4 mb-3' : 'mb-6'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-text-muted flex-shrink-0" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <p className="text-sm text-text-secondary">{t('loginToComment')}</p>
        </div>
      )}

      {/* List */}
      <div className={compact ? 'flex-1 overflow-y-auto px-4 pb-4' : ''}>
        <CommentList commentsData={commentsData} />
      </div>
    </div>
  );
}
