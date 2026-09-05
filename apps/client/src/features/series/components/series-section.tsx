'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SeriesCarousel } from '@/components/series/series-carousel';
import { SeriesCardSkeletonRow } from '@/components/series/series-card-skeleton';
import type { SeriesSectionProps } from '../types';

export function SeriesSection({
  titleKey,
  viewAllHref,
  series,
  isLoading,
  error,
}: SeriesSectionProps) {
  const t = useTranslations('home');
  const tSeries = useTranslations('series');

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
          <span className="text-accent">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t(`sections.${titleKey}` as any)}
          </span>
        </h2>

        <Link
          href={viewAllHref}
          className="
            flex items-center gap-1.5 text-sm font-medium
            text-text-muted hover:text-accent
            transition-colors duration-200 group/link
          "
        >
          {t('viewAll')}
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover/link:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Content */}
      {isLoading && <SeriesCardSkeletonRow />}

      {Boolean(error) && (
        <div className="py-8 text-center text-text-muted text-sm">
          {tSeries('error')}
        </div>
      )}

      {!isLoading && !Boolean(error) && series.length === 0 && (
        <div className="py-8 text-center text-text-muted text-sm">
          {tSeries('noResults')}
        </div>
      )}

      {!isLoading && !Boolean(error) && series.length > 0 && (
        <SeriesCarousel series={series} />
      )}
    </section>
  );
}
