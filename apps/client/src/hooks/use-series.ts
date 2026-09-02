'use client';

import { useQuery } from '@tanstack/react-query';
import { seriesKeys } from '@/lib/query/keys';
import {
  getReleaseSeries,
  getTopSeries,
  getDaySeries,
  getSeriesByCategory,
} from '@/lib/api/series';
import type { SeriesCategory, SeriesQueryParams } from '@/lib/api/types';

/**
 * Fetch release series for the home carousel.
 */
export function useReleaseSeries(lang: string, limit = 10) {
  return useQuery({
    queryKey: seriesKeys.category('release', lang),
    queryFn: () =>
      getReleaseSeries({ lang: lang as SeriesQueryParams['lang'], limit }),
  });
}

/**
 * Fetch top series for the home carousel.
 */
export function useTopSeries(lang: string, limit = 10) {
  return useQuery({
    queryKey: seriesKeys.category('top', lang),
    queryFn: () =>
      getTopSeries({ lang: lang as SeriesQueryParams['lang'], limit }),
  });
}

/**
 * Fetch daily series for the home carousel.
 */
export function useDaySeries(lang: string, limit = 10) {
  return useQuery({
    queryKey: seriesKeys.category('day', lang),
    queryFn: () =>
      getDaySeries({ lang: lang as SeriesQueryParams['lang'], limit }),
  });
}

/**
 * Fetch series by category with pagination — used by the full list page.
 */
export function useCategorySeries(
  category: SeriesCategory,
  lang: string,
  limit = 20,
  offset = 0,
) {
  return useQuery({
    queryKey: seriesKeys.categoryPaginated(category, lang, offset),
    queryFn: () =>
      getSeriesByCategory(category, {
        lang: lang as SeriesQueryParams['lang'],
        limit,
        offset,
      }),
  });
}
