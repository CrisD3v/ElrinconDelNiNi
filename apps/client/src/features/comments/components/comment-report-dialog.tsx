'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface CommentReportDialogProps {
  commentId: string;
  onReport: (commentId: string, reason?: string) => Promise<{ reported: boolean; hidden: boolean }>;
  onClose: () => void;
}

const REPORT_REASONS = [
  'spam',
  'harassment',
  'spoiler_unmarked',
  'hate_speech',
  'misinformation',
  'other',
] as const;

export function CommentReportDialog({ commentId, onReport, onClose }: CommentReportDialogProps) {
  const t = useTranslations('comments');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const reason = selectedReason === 'other' ? customReason : selectedReason;
      await onReport(commentId, reason || undefined);
      setDone(true);
      setTimeout(onClose, 1500);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-dark-600/60 bg-dark-900/98 p-6 shadow-2xl">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gold-400" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="font-semibold text-text-primary">{t('reportSent')}</p>
            <p className="text-sm text-text-secondary">{t('reportThanks')}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gold-400" strokeWidth="2">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                  <line x1="4" y1="22" x2="4" y2="15"/>
                </svg>
                {t('reportComment')}
              </h3>
              <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <p className="text-sm text-text-secondary mb-4">{t('reportReason')}</p>

            <div className="space-y-2 mb-4">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'border-gold-500/50 bg-gold-500/10'
                      : 'border-dark-600/50 bg-dark-800/40 hover:border-dark-500/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="hidden"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedReason === reason ? 'border-gold-500 bg-gold-500' : 'border-dark-500'
                  }`}>
                    {selectedReason === reason && (
                      <div className="w-1.5 h-1.5 rounded-full bg-dark-900" />
                    )}
                  </div>
                  <span className="text-sm text-text-primary">{t(`reportReasons.${reason}`)}</span>
                </label>
              ))}
            </div>

            {selectedReason === 'other' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder={t('reportOtherPlaceholder')}
                className="w-full rounded-xl border border-dark-600/50 bg-dark-800/60 px-3 py-2 text-sm text-text-primary placeholder-text-muted resize-none mb-4 focus:outline-none focus:border-gold-500/50 transition-colors"
                rows={3}
                maxLength={200}
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl text-sm text-text-secondary border border-dark-600/50 hover:border-dark-500/60 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedReason || submitting}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-gold-500/20 border border-gold-500/40 text-gold-300 hover:bg-gold-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? '...' : t('sendReport')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
