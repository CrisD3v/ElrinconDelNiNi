'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '@/hooks/use-carousel';
import { SeriesCard } from './series-card';
import type { SeriesDetail } from '@/lib/api/types';

interface SeriesCarouselProps {
  series: SeriesDetail[];
}

export function SeriesCarousel({ series }: SeriesCarouselProps) {
  const { containerRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight } =
    useCarousel({ scrollAmount: 400 });

  return (
    <div className="relative group/carousel">
      {/* Scroll container */}
      <div
        ref={containerRef}
        className="
          flex gap-4 overflow-x-auto scrollbar-hidden
          scroll-smooth snap-x snap-mandatory
          pb-2 -mb-2
        "
      >
        {series.map((item) => (
          <div key={item.id} className="snap-start">
            <SeriesCard series={item} />
          </div>
        ))}
      </div>

      {/* Left fade gradient */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      )}

      {/* Right fade gradient */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      )}

      {/* Navigation buttons */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="
            absolute left-2 top-1/3 -translate-y-1/2 z-20
            w-10 h-10 rounded-full
            bg-dark-800/90 border border-border
            flex items-center justify-center
            text-text-secondary hover:text-accent hover:border-accent/50
            transition-all duration-200
            opacity-0 group-hover/carousel:opacity-100
            cursor-pointer shadow-lg
          "
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="
            absolute right-2 top-1/3 -translate-y-1/2 z-20
            w-10 h-10 rounded-full
            bg-dark-800/90 border border-border
            flex items-center justify-center
            text-text-secondary hover:text-accent hover:border-accent/50
            transition-all duration-200
            opacity-0 group-hover/carousel:opacity-100
            cursor-pointer shadow-lg
          "
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
