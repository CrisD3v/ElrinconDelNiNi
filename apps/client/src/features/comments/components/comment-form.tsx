'use client';

import { useTranslations } from 'next-intl';
import { useCommentForm } from '../hooks/use-comment-form';
import type { CommentUser } from '@elrincondelnini/types';

interface CommentFormProps {
  onSubmit: (payload: { content: string; isSpoiler: boolean; image: File | null }) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  compact?: boolean;
  autoFocus?: boolean;
}

export function CommentForm({
  onSubmit,
  onCancel,
  placeholder,
  compact = false,
  autoFocus = false,
}: CommentFormProps) {
  const t = useTranslations('comments');
  const {
    content,
    isSpoiler,
    imagePreview,
    submitting,
    error,
    mentionResults,
    showMentions,
    textareaRef,
    fileInputRef,
    handleContentChange,
    insertMention,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleCancel,
    setIsSpoiler,
    setShowMentions,
  } = useCommentForm({ onSubmit, onCancel });

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={`rounded-2xl border transition-all ${
          compact
            ? 'border-dark-600/50 bg-dark-800/40'
            : 'border-dark-600/60 bg-dark-800/60'
        } focus-within:border-gold-500/40`}
      >
        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowMentions(false);
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e as any);
            }}
            placeholder={placeholder || t('commentPlaceholder')}
            autoFocus={autoFocus}
            className="w-full bg-transparent px-4 pt-3 pb-2 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none min-h-[80px]"
            maxLength={1000}
          />

          {/* @mention autocomplete */}
          {showMentions && mentionResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-dark-600/60 bg-dark-900/95 backdrop-blur-sm shadow-2xl overflow-hidden">
              {mentionResults.map((user: CommentUser) => (
                <button
                  key={user.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(user);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-dark-700/60 transition-colors"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.displayName}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-dark-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-text-secondary font-bold">
                        {user.displayName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-text-primary">{user.displayName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="px-4 pb-2 relative inline-block">
            <img
              src={imagePreview}
              alt="Adjunto"
              className="max-h-40 rounded-xl object-cover border border-dark-600/50"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-0 right-0 -translate-y-1 translate-x-1 w-5 h-5 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center hover:bg-dark-700 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center gap-1">
            {/* Attach image */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
              id="comment-image-input"
            />
            <label
              htmlFor="comment-image-input"
              className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text-secondary hover:bg-dark-700/50 transition-all"
              title={t('attachImage')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </label>

            {/* Spoiler toggle */}
            <button
              type="button"
              onClick={() => setIsSpoiler(!isSpoiler)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                isSpoiler
                  ? 'border-gold-500/50 bg-gold-500/15 text-gold-400'
                  : 'border-dark-600/40 text-text-muted hover:text-text-secondary hover:border-dark-500/50'
              }`}
              title={t('markSpoiler')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              {t('spoiler')}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">{content.length}/1000</span>
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary border border-dark-600/40 hover:border-dark-500/60 transition-all"
              >
                {t('cancel')}
              </button>
            )}
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gold-500/20 border border-gold-500/40 text-gold-300 hover:bg-gold-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  {t('publishing')}
                </span>
              ) : (
                t('publish')
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </form>
  );
}
