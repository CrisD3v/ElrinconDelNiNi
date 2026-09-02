'use client';

import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface ChapterNavigationProps {
  seriesId: string;
  prevChapterId: string | null;
  nextChapterId: string | null;
  currentChapterNumber: string | null;
}

export function ChapterNavigation({
  seriesId,
  prevChapterId,
  nextChapterId,
  currentChapterNumber,
}: ChapterNavigationProps) {
  return (
    <div className="border-t border-dark-800 bg-dark-900/80 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Current Chapter Label */}
        {currentChapterNumber && (
          <p className="text-center text-text-muted text-xs font-medium mb-4 uppercase tracking-wider">
            Fin del Episodio {currentChapterNumber}
          </p>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          {/* Previous Chapter */}
          {prevChapterId ? (
            <Link
              href={`/series/detail/${seriesId}/chapter/${prevChapterId}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-accent/30 text-text-secondary hover:text-accent transition-all duration-200 group"
            >
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              <span className="text-sm font-semibold">Anterior</span>
            </Link>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-dark-800/40 border border-dark-800 text-text-muted cursor-not-allowed">
              <ChevronLeft size={16} />
              <span className="text-sm font-semibold">Anterior</span>
            </div>
          )}

          {/* Back to Series */}
          <Link
            href={`/series/detail/${seriesId}`}
            className="shrink-0 p-3 rounded-xl bg-accent/10 hover:bg-accent/20 border border-accent/20 hover:border-accent/40 text-accent transition-all duration-200 group"
            aria-label="Volver a la serie"
          >
            <BookOpen
              size={18}
              className="group-hover:scale-110 transition-transform"
            />
          </Link>

          {/* Next Chapter */}
          {nextChapterId ? (
            <Link
              href={`/series/detail/${seriesId}/chapter/${nextChapterId}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent hover:bg-accent-hover text-dark-950 font-bold transition-all duration-200 group shadow-lg shadow-accent/20"
            >
              <span className="text-sm font-semibold">Siguiente</span>
              <ChevronRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-dark-800/40 border border-dark-800 text-text-muted cursor-not-allowed">
              <span className="text-sm font-semibold">Siguiente</span>
              <ChevronRight size={16} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
