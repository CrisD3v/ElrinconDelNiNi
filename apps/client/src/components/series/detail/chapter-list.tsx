'use client';
import { BookOpen } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Chapter } from '@/lib/api/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChapterListProps {
  chapters: Chapter[];
  seriesId: string;
}

export function ChapterList({ chapters, seriesId }: ChapterListProps) {
  if (!chapters?.length) {
    return (
      <div className="py-12 text-center text-text-muted">
        No hay episodios disponibles aún.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[650px] w-full border-t border-dark-800 bg-transparent pt-4 pr-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-4">
        {chapters.map((chapter) => {
          const chapterNumber = chapter.chapter || 'Extra';
          const displayTitle = chapter.title ? `: ${chapter.title}` : '';
          const formattedDate = new Date(chapter.publishAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          return (
            <Link 
              key={chapter.id} 
              href={`/series/detail/${seriesId}/chapter/${chapter.id}`}
              className="group flex items-center justify-between gap-3 p-3 rounded-lg bg-dark-800/30 hover:bg-dark-800/90 transition-all cursor-pointer border border-transparent hover:border-dark-600 hover:shadow-md"
            >
              {/* Información Principal */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-md bg-dark-900/80 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform group-hover:text-accent group-hover:border-accent/40 shadow-sm">
                  <BookOpen size={14} className="text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-text-primary font-semibold text-sm group-hover:text-accent transition-colors truncate">
                    Episodio {chapterNumber}{displayTitle}
                  </span>
                  <div className="flex items-center gap-2 text-text-muted text-[11px] mt-0.5">
                    <span>{formattedDate}</span>
                    <span className="w-1 h-1 rounded-full bg-dark-600" />
                    <span className="uppercase font-bold text-text-secondary">{chapter.translatedLanguage}</span>
                  </div>
                </div>
              </div>

              {/* Botón Leer / Action */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <span className="bg-dark-700/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-md hover:bg-accent hover:text-white transition-colors border border-white/5">
                  LEER
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}
