import type { SeriesDetail, SeriesCategory, SeriesQueryParams } from '@elrincondelnini/types';

export type { SeriesDetail, SeriesCategory, SeriesQueryParams };

export interface HeroBannerProps {
  series: SeriesDetail | null;
  className?: string;
}

export interface HeroBannerContentProps {
  series: SeriesDetail;
}

export interface HeroBannerCardProps {
  series: SeriesDetail;
}

export interface SeriesSectionProps {
  titleKey: 'releases' | 'top' | 'day';
  viewAllHref: string;
  series: SeriesDetail[];
  isLoading?: boolean;
  error?: string | Error | null;
}
