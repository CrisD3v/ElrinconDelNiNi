'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategorySeries } from '@/hooks/use-series';
import { SeriesGrid } from '@/components/series/series-grid';
import { SeriesCardSkeletonRow } from '@/components/series/series-card-skeleton';
import { Button } from '@/components/ui/button';
import type { SeriesCategory } from '@/lib/api/types';
import { use } from 'react';

const VALID_CATEGORIES: SeriesCategory[] = ['release', 'top', 'day'];
const ITEMS_PER_PAGE = 20;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  const locale = useLocale();
  const t = useTranslations('home');
  const tSeries = useTranslations('series');
  const [offset, setOffset] = useState(0);

  const validCategory = (VALID_CATEGORIES.includes(category as SeriesCategory) 
    ? category 
    : 'release') as SeriesCategory;

  const { data, isLoading, error } = useCategorySeries(
    validCategory,
    locale,
    ITEMS_PER_PAGE,
    offset,
  );

  // Validate category
  if (!VALID_CATEGORIES.includes(category as SeriesCategory)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-text-muted text-lg">{tSeries('noResults')}</p>
      </div>
    );
  }

  const categoryTitleMap: Record<SeriesCategory, string> = {
    release: 'releases',
    top: 'top',
    day: 'day',
  };

  const currentPage = Math.floor(offset / ITEMS_PER_PAGE) + 1;
  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          <span className="bg-gradient-to-r from-accent to-gold-300 bg-clip-text text-transparent">
            {t(`sections.${categoryTitleMap[validCategory]}`)}
          </span>
        </h1>
        {data && (
          <p className="mt-2 text-text-muted text-sm">
            {data.total} {tSeries('noResults').includes('series') ? 'series' : 'series'}
          </p>
        )}
      </div>

      {/* Content */}
      {isLoading && (
        <div className="space-y-4">
          <SeriesCardSkeletonRow count={6} />
          <SeriesCardSkeletonRow count={6} />
          <SeriesCardSkeletonRow count={6} />
        </div>
      )}

      {error && (
        <div className="py-16 text-center text-text-muted">
          {tSeries('error')}
        </div>
      )}

      {data && data.series.length === 0 && (
        <div className="py-16 text-center text-text-muted">
          {tSeries('noResults')}
        </div>
      )}

      {data && data.series.length > 0 && (
        <>
          <SeriesGrid series={data.series} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOffset(Math.max(0, offset - ITEMS_PER_PAGE))}
                disabled={offset === 0}
              >
                <ChevronLeft size={16} />
              </Button>

              <span className="text-sm text-text-secondary">
                {tSeries('page')} {currentPage} / {totalPages}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOffset(offset + ITEMS_PER_PAGE)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
