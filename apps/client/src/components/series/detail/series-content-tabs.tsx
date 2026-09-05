'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChapterList } from './chapter-list';
import { SeasonSelector } from './season-selector';
import { CommentSection } from '@/features/comments';
import type { Chapter } from '@/lib/api/types';

interface SeriesContentTabsProps {
  chapters: Chapter[];
  seriesId: string;
  seasons?: { id: string; name: string }[];
}

export function SeriesContentTabs({ chapters, seriesId, seasons = [] }: SeriesContentTabsProps) {
  const t = useTranslations('detail');
  const [activeTab, setActiveTab] = useState<'episodes' | 'comments'>('episodes');

  return (
    <div className="flex-1 w-full min-w-0">
      {/* Tab nav */}
      <div className="flex items-center gap-1 mb-6 border-b border-dark-700/50">
        <button
          id="tab-episodes"
          onClick={() => setActiveTab('episodes')}
          className={`relative px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'episodes'
              ? 'text-text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {t('episodes')}
          {activeTab === 'episodes' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-full" />
          )}
        </button>
        <button
          id="tab-comments"
          onClick={() => setActiveTab('comments')}
          className={`relative px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'comments'
              ? 'text-text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {t('comments')}
          {activeTab === 'comments' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'episodes' && (
        <>
          <SeasonSelector seasons={seasons} activeSeasonId={''} />
          <div className="mt-8">
            <ChapterList chapters={chapters} seriesId={seriesId} />
          </div>
        </>
      )}

      {activeTab === 'comments' && (
        <CommentSection mangaId={seriesId} />
      )}
    </div>
  );
}
